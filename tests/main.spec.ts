import * as fs from "node:fs";
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { parseAngularTemplateFile, parseAngularTemplate } from "../src/main";

test("parseAngularTemplate returns the same result as parseAngularTemplateFile", async () => {
	const templatePath = "tests/sample/src/app/plain/plain.html";
	const template = fs.readFileSync(templatePath, "utf-8");
	const result = await parseAngularTemplate(template, templatePath);
	assert.deepStrictEqual(result, [
		{
			plain: "<p><span>plain works!</span></p><p>plain works!</p>",
			annotated:
				'<p data-ngx-html-bridge-line="0" data-ngx-html-bridge-col="0" data-ngx-html-bridge-start-offset="0" data-ngx-html-bridge-end-offset="32"><span data-ngx-html-bridge-line="0" data-ngx-html-bridge-col="3" data-ngx-html-bridge-start-offset="3" data-ngx-html-bridge-end-offset="28">plain works!</span></p><p data-ngx-html-bridge-line="1" data-ngx-html-bridge-col="0" data-ngx-html-bridge-start-offset="33" data-ngx-html-bridge-end-offset="52">plain works!</p>',
		},
	]);
});

test("parseAngularTemplateFile returns expected HTML for a plain template", async () => {
	const templatePath = "tests/sample/src/app/plain/plain.html";
	const result = await parseAngularTemplateFile(templatePath);
	assert.deepStrictEqual(result, [
		{
			plain: "<p><span>plain works!</span></p><p>plain works!</p>",
			annotated:
				'<p data-ngx-html-bridge-line="0" data-ngx-html-bridge-col="0" data-ngx-html-bridge-start-offset="0" data-ngx-html-bridge-end-offset="32"><span data-ngx-html-bridge-line="0" data-ngx-html-bridge-col="3" data-ngx-html-bridge-start-offset="3" data-ngx-html-bridge-end-offset="28">plain works!</span></p><p data-ngx-html-bridge-line="1" data-ngx-html-bridge-col="0" data-ngx-html-bridge-start-offset="33" data-ngx-html-bridge-end-offset="52">plain works!</p>',
		},
	]);
});

test("parseAngularTemplateFile returns expected HTML for @if, @else if, and @else blocks", async () => {
	const templatePath = "tests/sample/src/app/if/if.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(
		result.sort(),
		[
			"<p>Condition is true!</p>",
			"<p>Else if condition is true!</p>",
			"<p>All conditions are false!</p>",
		].sort(),
	);
});

test("parseAngularTemplateFile returns expected HTML for @if without else", async () => {
	const templatePath =
		"tests/sample/src/app/if-without-else/if-without-else.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(
		result.sort(),
		["<p>Condition is true!</p>", ""].sort(),
	);
});

test("parseAngularTemplateFile returns expected HTML for @switch, @case, and @default blocks", async () => {
	const templatePath = "tests/sample/src/app/switch/switch.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(
		result.sort(),
		["<p>Case 1</p>", "<p>Case 2</p>", "<p>Default case</p>"].sort(),
	);
});

test("parseAngularTemplateFile returns expected HTML for @for block", async () => {
	const templatePath = "tests/sample/src/app/for/for.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(
		result.sort(),
		[
			"",
			"<p>some random text</p>",
			"<p>some random text</p><p>some random text</p>",
		].sort(),
	);
});

test("parseAngularTemplateFile returns expected HTML for @for block with @empty", async () => {
	const templatePath =
		"tests/sample/src/app/for-with-empty/for-with-empty.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(
		result.sort(),
		[
			"<p>No items.</p>",
			"<p>some random text</p>",
			"<p>some random text</p><p>some random text</p>",
		].sort(),
	);
});

test("parseAngularTemplateFile returns expected HTML for @defer block", async () => {
	const templatePath = "tests/sample/src/app/defer/defer.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(
		result.sort(),
		[
			"<p>Deferred content loaded!</p>",
			"<p>Placeholder content</p>",
			"<p>Loading...</p>",
		].sort(),
	);
});

test("parseAngularTemplateFile returns expected HTML for *ngIf", async () => {
	const templatePath = "tests/sample/src/app/ngif/ngif.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(
		result.sort(),
		[
			"<div><p>Condition is true!</p></div>",
			"<p>Condition is false!</p>",
		].sort(),
	);
});

test("parseAngularTemplateFile returns expected HTML for *ngIf without else", async () => {
	const templatePath =
		"tests/sample/src/app/ngif-without-else/ngif-without-else.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(
		result.sort(),
		["<div><p>Condition is true!</p></div>", ""].sort(),
	);
});

test("parseAngularTemplateFile returns expected HTML for *ngIf with then", async () => {
	const templatePath =
		"tests/sample/src/app/ngif-with-then/ngif-with-then.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(
		result.sort(),
		["<p>Condition is true (then block)!</p>", ""].sort(),
	);
});

test("parseAngularTemplateFile returns expected HTML for @switch with single case and no default", async () => {
	const templatePath =
		"tests/sample/src/app/switch-without-default/switch-without-default.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(result.sort(), ["<p>Case 1</p>", ""].sort());
});

test("parseAngularTemplateFile returns expected HTML for attributes", async () => {
	const templatePath = "tests/sample/src/app/attr/attr.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(
		result.sort(),
		[
			'<p lang="ja" hidden="until-found" translate="no"> attr works!\n</p>',
		].sort(),
	);
});

test("parseAngularTemplateFile returns expected HTML for ternary operator in property binding", async () => {
	const templatePath =
		"tests/sample/src/app/ternary-operator/ternary-operator.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(
		result.sort(),
		[
			'<div hidden="until-found">Ternary Operator Test</div>',
			'<div hidden="">Ternary Operator Test</div>',
			"<div>Ternary Operator Test</div>",
		].sort(),
	);
});

test("parseAngularTemplateFile ignores style and class binding", async () => {
	const templatePath = "tests/sample/src/app/style-binding/style-binding.html";
	const result = (await parseAngularTemplateFile(templatePath)).map((r) => r.plain);
	assert.deepStrictEqual(result.sort(), ["<p>style-binding works!</p>"].sort());
});
