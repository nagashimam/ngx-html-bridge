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
