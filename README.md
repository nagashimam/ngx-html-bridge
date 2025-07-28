# ngx-html-bridge(WIP)

[![NPM Version](https://img.shields.io/npm/v/ngx-html-bridge.svg)](https://www.npmjs.com/package/ngx-html-bridge)
[![Build Status](https://img.shields.io/travis/com/user/ngx-html-bridge.svg)](https://travis-ci.com/user/ngx-html-bridge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`ngx-html-bridge` is a powerful parser that converts Angular templates into an array of standard, static HTML strings. This enables you to use any HTML validator of your choice on your Angular templates, bridging the gap between Angular's dynamic syntax and standard HTML validation tools.

## Core Purpose

The primary goal of this project is to allow developers to validate the potential HTML output of their Angular templates. By parsing Angular-specific syntax (like `*ngIf`, `*ngFor`, `[property]`, etc.) and generating all possible static HTML variations, it provides a reliable input for linters and validators that only understand plain HTML.

## Key Features

-   **Parses Angular Syntax:** Understands built-in control flow, structural directives (`*ngIf`, `*ngFor`), property binding, and more.
-   **Generates HTML Variations:** Creates a comprehensive array of all possible HTML outputs based on the template's logic.
-   **Outputs Pure HTML:** The final output is a set of pure, static HTML strings, free of any Angular-specific syntax.

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
import { parseTemplate } from '../src/main';
import * as fs from 'fs';

// Read an Angular template from a file
const template = fs.readFileSync('path/to/your/template.html', 'utf-8');

// Parse the template to get all possible HTML string outputs
const htmlVariations = parseTemplate(template);

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
