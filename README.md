# ngx-html-bridge (WIP)

[![NPM Version](https://img.shields.io/npm/v/ngx-html-bridge.svg)](https://www.npmjs.com/package/ngx-html-bridge)
[![Build Status](https://img.shields.io/travis/com/user/ngx-html-bridge.svg)](https://travis-ci.com/user/ngx-html-bridge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`ngx-html-bridge` is a powerful parser that converts Angular templates into an array of standard, static HTML strings. This enables you to use any HTML validator of your choice on your Angular templates, bridging the gap between Angular's dynamic syntax and standard HTML validation tools.

## Core Purpose

The primary goal of this project is to allow developers to validate the potential HTML output of their Angular templates. By parsing Angular-specific syntax and generating all possible static HTML variations, it provides a reliable input for linters and validators that only understand plain HTML.

## How It Works

The tool operates in a multi-step process:

1.  **Parses the Angular Template:** It uses the **`@angular/compiler`** to parse the HTML template file into an Abstract Syntax Tree (AST).
2.  **Parses the Component File:** It looks for a corresponding `.ts` file for the template and uses **`@typescript-eslint/typescript-estree`** to parse it. This allows it to extract initial values from public and protected properties, which are used to resolve attribute bindings.
3.  **Transforms the AST:** It walks the AST and transforms Angular-specific syntax into a series of DOM node variations.
4.  **Generates HTML:** Finally, it uses **`jsdom`** to convert the DOM node variations into an array of pure, static HTML strings.

## Supported Features

`ngx-html-bridge` supports a wide range of Angular template syntax:

-   **Structural Directives:**
    -   `*ngIf` (with `then` and `else` clauses)
-   **Built-in Control Flow:**
    -   `@if`, `@else if`, `@else`
    -   `@for` (including the `@empty` block)
    -   `@switch`, `@case`, `@default`
    -   `@defer` (including `@placeholder` and `@loading` blocks)
-   **Property and Attribute Binding:**
    -   Resolves `[attribute]` bindings based on property values from the component's TypeScript file.
    -   Handles ternary operators in bindings to generate multiple output variations.

## Limitations

It's important to understand the current limitations of the tool to use it effectively:

-   **Placeholder Values:** The library often uses placeholder values for dynamic content.
    -   Text bindings (e.g., `{{ myProperty }}`) are replaced with a static placeholder string: `"some random text"`.
    -   Property bindings that cannot be resolved to a simple literal (e.g., complex function calls) will also fall back to a placeholder.
-   **`@for` Loop Behavior:** The parser does not render `@for` loops based on actual data. Instead, it generates a fixed set of variations to cover common scenarios:
    -   One variation for the `@empty` case (if the block exists).
    -   One variation for a single loop iteration.
    -   One variation for two loop iterations (to test the plural case).

## Installation

To get started with development, clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/ngx-html-bridge.git
cd ngx-html-bridge
npm install
```

## Usage

The tool can be used as a library in your own scripts. Here is a basic example:

```typescript
// examples/basic-usage.ts
import { parseAngularTemplate } from '../src/main';

// Define the path to your Angular template
const templatePath = 'path/to/your/template.html';

// Parse the template to get all possible HTML string outputs
const htmlVariations = parseAngularTemplate(templatePath);

// Log the variations to the console
console.log(htmlVariations);

/*
  You can now iterate through `htmlVariations` and run each string
  through your favorite HTML validator or linter.
*/
```

To run the example file, use:

```bash
npm run example
```

## Development Scripts

-   **Install dependencies:** `npm install`
-   **Build the tool:** `npm run build`
-   **Run tests:** `npm test`
-   **Lint the code:** `npm run lint`

## Contributing

Contributions are welcome! Please feel free to fork the repository, make your changes, and submit a pull request. Ensure that all tests and lint checks pass before submitting.

## License

This project is licensed under the MIT License.
