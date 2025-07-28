# ARCHITECTURE.md: ngx-html-bridge Parser Architecture

## 1. Project Goal

The `ngx-html-bridge` project aims to convert Angular templates, which contain dynamic syntax (e.g., structural directives like `*ngIf`, `*ngFor`, and new control flow like `@if`, `@for`), into an array of standard, static HTML strings. This output can then be fed into any generic HTML validator or linter, enabling comprehensive validation of Angular templates without requiring tools that natively understand Angular's specific syntax. The core challenge is to generate all possible HTML variations that a given Angular template could produce at runtime.

## 2. Architectural Pipeline Overview

The architecture is designed as a clear, phased pipeline, transforming the input template through several distinct stages. The key to this design is leveraging Angular's official compiler for the initial parsing and JSDOM for robust DOM manipulation and HTML serialization.

**`Template Input -> Angular AST -> [JSDOM Node[][]] -> [HTML Strings]`**

Each stage has a specific responsibility, ensuring modularity, testability, and maintainability.

## 3. Detailed Pipeline Stages

### Stage 1: Parsing (Leveraging `@angular/compiler`)

This initial stage is responsible for transforming the raw Angular template into a structured, hierarchical representation. Instead of building a custom parser, we will directly utilize Angular's internal compiler.

*   **Input:** Either the raw Angular template as a string, or a file path pointing to the template file. If a file path is provided, the content of the file will be read to obtain the template string.
*   **Tool:** The `parseTemplate` function from the `@angular/compiler` package.
*   **Output:** The official Angular Template Abstract Syntax Tree (AST). This AST is a rich data structure that accurately represents all Angular-specific syntax, including elements, text, bindings, and directives.
*   **Key Advantage:** By using Angular's own parser, we ensure 100% accuracy in interpreting Angular syntax and automatic compatibility with future Angular versions and features (like `@if`, `@for`, `@switch` blocks).
*   **Crucial First Step:** Before implementing the next stage, it is essential to thoroughly explore and understand the structure of the Angular AST produced by `parseTemplate` for various template constructs.

### Stage 2: Transformation & Logic Expansion (The Core Logic)

This is the central and most complex stage, where the dynamic Angular AST is transformed into multiple static HTML representations.

*   **Input:** The single, dynamic Angular AST obtained from Stage 1.
*   **Output:** A 2D array of JSDOM `Node` objects (`Node[][]`).
    *   The **first dimension** of the array represents different *combinations* or "realities" of the HTML output (e.g., one combination for the `@if` true branch, another for the `@else` branch).
    *   The **second dimension** of each inner array represents the sequential list of JSDOM `Node` objects (like `HTMLElement`, `Text`, `Attr`) that constitute a single static HTML output.
*   **Core Logic:**
    *   **Visitor Pattern:** A `Transformer` class will implement a visitor pattern, with specific `transform` methods for each relevant Angular AST node type (e.g., `transformIfBlock`, `transformForBlock`, `transformBoundText`).
    *   **JSDOM Integration:** All HTML elements, text nodes, and attributes will be created using a JSDOM `Document` instance (`document.createElement`, `document.createTextNode`, `element.setAttribute`).
    *   **Handling Control Flow (`@if`, `@switch`):** When an `@if` or `@switch` block is encountered, the transformer will recursively process its branches. The results from each branch (e.g., the `@if` content and the `@else` content) will be collected and concatenated into the overall `Node[][]` output, effectively creating multiple distinct HTML combinations. If an `@if` lacks an `@else`, an empty `Node[]` combination will be added to represent the "nothing rendered" scenario.
    *   **Handling Iteration (`@for`):** For `@for` blocks, a pragmatic "zero and one" strategy will be employed:
        1.  **Zero Iterations:** An empty `Node[]` combination will be added to represent the case where the loop renders nothing.
        2.  **One Iteration:** A single iteration of the loop's content will be transformed. This will require pre-processing the Angular AST nodes within the loop to replace dynamic loop variables (e.g., `item`, `index`) with static placeholder values before their transformation into JSDOM nodes.
    *   **Handling Bindings (`{{...}}`, `[...]`):** All dynamic bindings will be replaced with static placeholder values in the resulting JSDOM nodes (e.g., `{{name}}` becomes a `Text` node with `{{PLACEHOLDER}}`, `[hidden]="condition"` becomes an `Attribute` node with `hidden="PLACEHOLDER_VALUE"`).
    *   **`combineCombinations` Helper:** A crucial utility function will be used to combine the `Node[][]` results from sequential child nodes, effectively performing a Cartesian product to generate all possible sequences.

### Stage 3: Code Generation (JSDOM to HTML String)

The final stage converts the JSDOM `Node` arrays into their corresponding HTML string representations.

*   **Input:** The `Node[][]` (2D array of JSDOM `Node` objects) from Stage 2.
*   **Tool:** JSDOM's built-in serialization capabilities (e.g., `element.innerHTML`).
*   **Process:** For each `Node[]` (representing one complete HTML combination), a temporary JSDOM `div` element will be created. The nodes from the `Node[]` will be appended to this temporary `div` (using `cloneNode(true)` to avoid moving nodes if they are part of a larger structure). Finally, `tempDiv.innerHTML` will be used to extract the static HTML string.
*   **Output:** An array of static HTML strings, ready for validation.

This architecture provides a robust, maintainable, and scalable solution for transforming Angular templates into validatable HTML.
