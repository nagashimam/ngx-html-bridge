# Angular HTML Bridge Library

Bridge between Angular template and HTML.

## Overview

This library addresses common issues in Angular's template syntax that can lead to invalid HTML and potential conformance problems. By transforming Angular templates into valid HTML, it ensures compatibility with HTML specifications, improving browser compatibility and accessibility.

## Problems with Current Angular Syntax

### Invalid HTML Syntax

Angular templates can contain valid Angular syntax that is invalid HTML when evaluated without compilation. For example:

```html
<ul>
@if(users){
  @for(user of users; track user.id){
    <li>{{user.name}}</li>
  }
}
</ul>
```

In this example, the template is valid in Angular but invalid as HTML because text nodes are not allowed directly within a `<ul>` element.

### Control Flow and Conformance Issues

Control flow structures can hide potential conformance issues. Consider the following template:

```html
<dl>
  <dt>Authors</dt>
  @for(author of authors; track author.id){
    <dd>{{author.name}}</dd>
  }
</dl>
```

If `authors` is an empty array, the resulting HTML would be:

```html
<dl>
  <dt>Authors</dt>
</dl>
```

This is invalid because a `<dt>` element must be followed by a `<dd>` element.

## Solution Provided by the Library

The library provides a function called `bridge` that takes the path to an Angular template and returns a promise of an array of the template's HTML equivalents. This allows you to check the conformance of the generated HTML with any HTML checker.

### Example Usage

#### Conditional Statements

For a template with conditional statements:

```html
@if (flagA) {
  <p>A is true</p>
} @else if (flagB) {
  <p>B is true</p>
} @else {
  <p>Both A and B are false</p>
}
```

The `bridge` function returns:

```javascript
["<p>A is true</p>", "<p>B is true</p>", "<p>Both A and B are false</p>"]
```

#### Switch Statements

For a template with switch statements:

```html
@switch (str) {
  @case ("foo") {
    <p>str says foo</p>
  }
  @case ("bar") {
    <p>str says bar</p>
  }
  @default {
    <p>str says something else</p>
  }
}
```

The `bridge` function returns:

```javascript
["<p>str says foo</p>", "<p>str says bar</p>", "<p>str says something else</p>"]
```

#### Loop Structures

For a template with a loop:

```html
<ul>
  @for (item of items; track item) {
    <li>{{ item }}</li>
  }
</ul>
```

The `bridge` function returns:

```javascript
["<ul></ul>", "<ul><li>{{ item }}</li></ul>", "<ul><li>{{ item }}</li><li>{{ item }}</li></ul>"]
```

### Running HTML Checkers

You can use any HTML checker to validate the output HTML. Here is an example using `markuplint`:

```typescript
import { bridge } from "ngx-html-bridge";
import { MLEngine } from "markuplint";

const htmls = await bridge("path-to-your-template");
htmls.forEach(async (html) => {
  const result = await MLEngine.fromCode(html);
  console.log(result);
});
```

This library helps ensure that your Angular templates conform to HTML specifications, improving compatibility and accessibility.

## Installation(WIP)

```bash
npm i ngx-html-bridge
```

## License

This plugin is licensed under the MIT License.
