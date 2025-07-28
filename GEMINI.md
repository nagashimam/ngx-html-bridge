# GEMINI.md: Project ngx-html-bridges

This document provides context for the Gemini AI assistant to effectively contribute to this project.

## 1. Project Overview & Goal

- **Project Name:** ngx-html-bridge
- **Type:** Angular Template Parser
- **Core Purpose:** To convert Angular templates into an array of standard, static HTML strings. This enables developers to run any HTML validator of their choice against the generated output, including tools that do not natively support Angular's syntax.
- **Key Features:**
    - Parses Angular template syntax (built-in control flow, structural directives like *ngIf/*ngFor, property binding, etc.).
    - Generates a comprehensive array of HTML variations based on the template's logic.
    - Outputs pure, static HTML strings that are free of any Angular-specific syntax.

## 2. Tech Stack

- **Language:** TypeScript
- **Testing:** Node.js Test Runner
- **Linting/Formatting:** Biome
- **Package Manager:** npm

## 3. Project Structure

The project is a standalone parser tool built with TypeScript.

```
.
├── src/                    # Source code for the parser
│   ├── core/               # Core parsing and transformation logic
│   │   ├── parser/index.ts
│   │   ├── transformer/index.ts
│   │   ├── generator/index.ts
│   │   └── ...
│   ├── main.ts             # Main entry point for the tool/library
│   └── types/              # TypeScript type definitions
│       └── index.ts
├── tests/                  # Unit and integration tests
│   ├── core/
│   └── main.spec.ts
├── examples/               # Example usage scripts or templates
│   └── basic-usage.ts
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── .biome.json             # Biome configuration
└── README.md
```

## 4. Key Commands

These commands should be run from the project root.

- **Install dependencies:** `npm install`
- **Build the tool:** `npm run build`
- **Run tests:** `npm test`
- **Lint the code:** `npm run lint`
- **Run example:** `npm run example`

## 5. Coding Conventions & Style Guide

- **Style:** Follow standard TypeScript best practices.
- **Commit Messages:** Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. (e.g., `feat(core): add new feature`, `fix(parser): resolve bug in html parsing`)
- **Testing:** All new features or bug fixes must be accompanied by unit tests with a high level of code coverage.
- **Documentation:** Public APIs must have TSDoc comments.

## 6. Contribution Workflow

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feat/my-new-feature`).
3.  Make your changes.
4.  Ensure all tests and lint checks pass (`npm test` & `npm run lint`).
5.  Submit a pull request with a clear description of the changes.
