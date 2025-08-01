import { test } from "node:test";
import { strict as assert } from "node:assert";
import { parseAngularTemplate } from "../src/main";

test("parseAngularTemplate returns expected HTML for a plain template", () => {
	const templatePath = "tests/sample/src/app/plain/plain.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(result, [
		"<p><span>plain works!</span></p><p>plain works!</p>",
	]);
});

test("parseAngularTemplate returns expected HTML for @if, @else if, and @else blocks", () => {
	const templatePath = "tests/sample/src/app/if/if.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(
		result.sort(),
		[
			"<p>Condition is true!</p>",
			"<p>Else if condition is true!</p>",
			"<p>All conditions are false!</p>",
		].sort(),
	);
});

test("parseAngularTemplate returns expected HTML for @if without else", () => {
	const templatePath =
		"tests/sample/src/app/if-without-else/if-without-else.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(
		result.sort(),
		["<p>Condition is true!</p>", ""].sort(),
	);
});

test("parseAngularTemplate returns expected HTML for @switch, @case, and @default blocks", () => {
	const templatePath = "tests/sample/src/app/switch/switch.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(
		result.sort(),
		["<p>Case 1</p>", "<p>Case 2</p>", "<p>Default case</p>"].sort(),
	);
});

test("parseAngularTemplate returns expected HTML for @for block", () => {
	const templatePath = "tests/sample/src/app/for/for.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(
		result.sort(),
		[
			"",
			"<p>some random text</p>",
			"<p>some random text</p><p>some random text</p>",
		].sort(),
	);
});

test("parseAngularTemplate returns expected HTML for @for block with @empty", () => {
	const templatePath =
		"tests/sample/src/app/for-with-empty/for-with-empty.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(
		result.sort(),
		[
			"<p>No items.</p>",
			"<p>some random text</p>",
			"<p>some random text</p><p>some random text</p>",
		].sort(),
	);
});

test("parseAngularTemplate returns expected HTML for @defer block", () => {
	const templatePath = "tests/sample/src/app/defer/defer.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(
		result.sort(),
		[
			"<p>Deferred content loaded!</p>",
			"<p>Placeholder content</p>",
			"<p>Loading...</p>",
		].sort(),
	);
});

test("parseAngularTemplate returns expected HTML for *ngIf", () => {
	const templatePath = "tests/sample/src/app/ngif/ngif.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(
		result.sort(),
		[
			"<div><p>Condition is true!</p></div>",
			"<p>Condition is false!</p>",
		].sort(),
	);
});

test("parseAngularTemplate returns expected HTML for *ngIf without else", () => {
	const templatePath =
		"tests/sample/src/app/ngif-without-else/ngif-without-else.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(
		result.sort(),
		["<div><p>Condition is true!</p></div>", ""].sort(),
	);
});

test("parseAngularTemplate returns expected HTML for *ngIf with then", () => {
	const templatePath =
		"tests/sample/src/app/ngif-with-then/ngif-with-then.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(
		result.sort(),
		["<p>Condition is true (then block)!</p>", ""].sort(),
	);
});

test("parseAngularTemplate returns expected HTML for @switch with single case and no default", () => {
	const templatePath =
		"tests/sample/src/app/switch-without-default/switch-without-default.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(result.sort(), ["<p>Case 1</p>", ""].sort());
});

test("parseAngularTemplate returns expected HTML for attributes", () => {
	const templatePath = "tests/sample/src/app/attr/attr.html";
	const result = parseAngularTemplate(templatePath);
	assert.deepStrictEqual(
		result.sort(),
		[
			'<p lang="ja" hidden="until-found" translate="no"> attr works!\n</p>',
		].sort(),
	);
});
