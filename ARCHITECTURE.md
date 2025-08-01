# ARCHITECTURE.md: ngx-html-bridge Parser Architecture

## 1. Project Goal

The `ngx-html-bridge` project aims to convert Angular templates, which contain dynamic syntax (e.g., structural directives like `*ngIf`, `*ngFor`, and new control flow like `@if`, `@for`), into an array of standard, static HTML strings. This output can then be fed into any generic HTML validator or linter, enabling comprehensive validation of Angular templates without requiring tools that natively understand Angular's specific syntax. The core challenge is to generate all possible HTML variations that a given Angular template could produce at runtime.

## 2. Architectural Pipeline Overview

The architecture is designed as a clear, phased pipeline, transforming the input template through several distinct stages. The key to this design is leveraging Angular's official compiler for the initial parsing and JSDOM for robust DOM manipulation and HTML serialization.

**`Template Input -> (Angular AST, Component Properties) -> [JSDOM Node[][]] -> [HTML Strings]`**

Each stage has a specific responsibility, ensuring modularity, testability, and maintainability.

## 3. Detailed Pipeline Stages

### Stage 1: Parsing (Leveraging `@angular/compiler` and TypeScript)

This initial stage is responsible for transforming the raw Angular template and its corresponding TypeScript component file into structured, hierarchical representations.

*   **Input:** A file path pointing to the template file.
*   **Tools:**
    *   The `parseTemplate` function from the `@angular/compiler` package.
    *   The `@typescript-eslint/typescript-estree` package to parse the component's TypeScript file.
*   **Output:**
    *   The official Angular Template Abstract Syntax Tree (AST).
    *   A `Map` of the component's public and protected properties and their initial values.
*   **Key Advantage:** By using Angular's own parser, we ensure 100% accuracy in interpreting Angular syntax. By parsing the component's TypeScript, we can resolve property bindings in the template to their static values.

### Stage 2: Transformation & Logic Expansion (The Core Logic)

This is the central and most complex stage, where the dynamic Angular AST is transformed into multiple static HTML representations.

*   **Input:** The Angular AST and the component properties map from Stage 1.
*   **Output:** A 2D array of JSDOM `Node` objects (`Node[][]`).
    *   The **first dimension** of the array represents different *combinations* or "realities" of the HTML output (e.g., one combination for the `@if` true branch, another for the `@else` branch).
    *   The **second dimension** of each inner array represents the sequential list of JSDOM `Node` objects (like `HTMLElement`, `Text`, `Attr`) that constitute a single static HTML output.
*   **Core Logic:**
    *   **Visitor Pattern:** A `Transformer` class will implement a visitor pattern, with specific `transform` methods for each relevant Angular AST node type (e.g., `transformIfBlock`, `transformForBlock`, `transformBoundText`).
    *   **JSDOM Integration:** All HTML elements, text nodes, and attributes will be created using a JSDOM `Document` instance (`document.createElement`, `document.createTextNode`, `element.setAttribute`).
    *   **Handling Control Flow (`@if`, `@switch`):** When an `@if` or `@switch` block is encountered, the transformer will recursively process its branches. The results from each branch (e.g., the `@if` content and the `@else` content) will be collected and concatenated into the overall `Node[][]` output, effectively creating multiple distinct HTML combinations. If an `@if` lacks an `@else`, an empty `Node[]` combination will be added to represent the "nothing rendered" scenario.
    *   **Handling Iteration (`@for`):** For `@for` blocks, the transformer com combinations for an empty block (if present), a single iteration, and a double iteration to provide comprehensive test coverage.
        1.  **Empty Block:** An empty `Node[]` combination is added. If an `@empty` block exists, it is transformed and its result is used instead.
        2.  **One Iteration:** A single iteration of the loop's content is transformed.
        3.  **Two Iterations:** Two iterations of the loop's content are transformed to simulate a multi-item loop.
    *   **Handling Bindings (`{{...}}`, `[...]`):** Dynamic bindings are resolved using the properties map from Stage 1. If a binding cannot be resolved, a placeholder value is used.
    *   **`generateCombinations` Helper:** A crucial utility function will be used to combine the `Node[][]` results from sequential child nodes, effectively performing a Cartesian product to generate all possible sequences.

### Stage 3: Code Generation (JSDOM to HTML String)

The final stage converts the JSDOM `Node` arrays into their corresponding HTML string representations.

*   **Input:** The `Node[][]` (2D array of JSDOM `Node` objects) from Stage 2.
*   **Tool:** JSDOM's built-in serialization capabilities (e.g., `element.innerHTML`).
*   **Process:** For each `Node[]` (representing one complete HTML combination), a temporary JSDOM `div` element will be created. The nodes from the `Node[]` will be appended to this temporary `div` (using `cloneNode(true)` to avoid moving nodes if they are part of a larger structure). Finally, `tempDiv.innerHTML` will be used to extract the static HTML string.
*   **Output:** An array of static HTML strings, ready for validation.

This architecture provides a robust, maintainable, and scalable solution for transforming Angular templates into validatable HTML.

## 4. Assumptions and Limitations

### Property Parsing

The library makes the following assumptions when parsing component properties to resolve template bindings:

1.  **Initial Values Only:** The parser only considers the initial values of properties as defined in the component's TypeScript file. It does not and cannot account for changes that happen at runtime.
2.  **Limited Expression Support:** The parser can correctly extract values from literal assignments (e.g., `name = 'John'`) and from `input()` signals where the initial value is the first argument (e.g., `name = input('John')`). More complex initializers or expressions are not supported.
3.  **Placeholder for Unresolved Values:** When the parser cannot determine a static value for a property binding (due to complex expressions or unsupported syntax), it will use the placeholder string `"some random value"`.
