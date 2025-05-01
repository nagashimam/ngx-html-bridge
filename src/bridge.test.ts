import test from "node:test";
import assert from "node:assert";
import { resolve } from "node:path";
import { bridgeTemplateFile } from "../dist/bridge.js";

test("Can parse template without control flow", () => {
	const path = resolve(
		"src/__tests__/no-control-flow/no-control-flow.component.html",
	);
	const result = bridgeTemplateFile(path);
	assert.strictEqual(result.length, 1);
	assert.strictEqual(
		result[0],
		'<p data-ngx-html-bridge-col="0" data-ngx-html-bridge-line="0" data-ngx-html-bridge-offset="0" data-test="" aria-label="hello world">hello world</p><p data-ngx-html-bridge-col="0" data-ngx-html-bridge-line="1" data-ngx-html-bridge-offset="55">hello <span data-ngx-html-bridge-col="9" data-ngx-html-bridge-line="1" data-ngx-html-bridge-offset="64">Angular</span></p>',
	);
});

test("Can parse template with @if", () => {
	const path = resolve("src/__tests__/if/if.component.html");
	const result = bridgeTemplateFile(path);

	assert.strictEqual(result.length, 4);
	assert.strictEqual(
		result[0],
		'<p data-ngx-html-bridge-col="4" data-ngx-html-bridge-line="2" data-ngx-html-bridge-offset="34">Both flagA and flagB are true</p>',
	);
	assert.strictEqual(
		result[1],
		'<p data-ngx-html-bridge-col="4" data-ngx-html-bridge-line="4" data-ngx-html-bridge-offset="98">Both flagA and flagC are true</p>',
	);
	assert.strictEqual(
		result[2],
		'<p data-ngx-html-bridge-col="4" data-ngx-html-bridge-line="6" data-ngx-html-bridge-offset="151">only flagA is true</p>',
	);
	assert.strictEqual(
		result[3],
		'<p data-ngx-html-bridge-col="2" data-ngx-html-bridge-line="9" data-ngx-html-bridge-offset="193">flagA is false</p>',
	);
});

test("Can parse template with @switch", () => {
	const path = resolve("src/__tests__/switch/switch.component.html");
	const result = bridgeTemplateFile(path);

	assert.strictEqual(result.length, 3);
	assert.strictEqual(
		result[0],
		'<p data-ngx-html-bridge-col="4" data-ngx-html-bridge-line="2" data-ngx-html-bridge-offset="43">title is switch</p>',
	);
	assert.strictEqual(
		result[1],
		'<p data-ngx-html-bridge-col="4" data-ngx-html-bridge-line="5" data-ngx-html-bridge-offset="97">title is switch2</p>',
	);
	assert.strictEqual(
		result[2],
		'<p data-ngx-html-bridge-col="4" data-ngx-html-bridge-line="8" data-ngx-html-bridge-offset="142">title is not yet decided</p>',
	);
});

test("Can parse template with @for", () => {
	const path = resolve("src/__tests__/for/for.component.html");
	const result = bridgeTemplateFile(path);
	assert.strictEqual(result.length, 3);
	assert.strictEqual(
		result[0],
		'<li data-ngx-html-bridge-col="2" data-ngx-html-bridge-line="3" data-ngx-html-bridge-offset="80">There are no users.</li>',
	);
	assert.strictEqual(
		result[1],
		'<li data-ngx-html-bridge-col="2" data-ngx-html-bridge-line="1" data-ngx-html-bridge-offset="42">{{ user.name }}</li>',
	);
	assert.strictEqual(
		result[2],
		'<li data-ngx-html-bridge-col="2" data-ngx-html-bridge-line="1" data-ngx-html-bridge-offset="42">{{ user.name }}</li><li data-ngx-html-bridge-col="2" data-ngx-html-bridge-line="1" data-ngx-html-bridge-offset="42">{{ user.name }}</li>',
	);
});

test("Can parse template with @for without empty block", () => {
	const path = resolve(
		"src/__tests__/for-without-empty/for-without-empty.component.html",
	);
	const result = bridgeTemplateFile(path);
	assert.strictEqual(result.length, 3);
	assert.strictEqual(result[0], "");
	assert.strictEqual(
		result[1],
		'<li data-ngx-html-bridge-col="2" data-ngx-html-bridge-line="1" data-ngx-html-bridge-offset="42">{{ user.name }}</li>',
	);
	assert.strictEqual(
		result[2],
		'<li data-ngx-html-bridge-col="2" data-ngx-html-bridge-line="1" data-ngx-html-bridge-offset="42">{{ user.name }}</li><li data-ngx-html-bridge-col="2" data-ngx-html-bridge-line="1" data-ngx-html-bridge-offset="42">{{ user.name }}</li>',
	);
});

test("Can parse template with attribute binding", () => {
	const path = resolve(
		"src/__tests__/ternary-operator/ternary-operator.component.html",
	);
	const result = bridgeTemplateFile(path);
	assert.strictEqual(result.length, 3);
	assert.strictEqual(
		result[0],
		'<p data-ngx-html-bridge-col="0" data-ngx-html-bridge-line="0" data-ngx-html-bridge-offset="0" data-test="hi"> ternary-operator\n</p>',
	);
	assert.strictEqual(
		result[1],
		'<p data-ngx-html-bridge-col="0" data-ngx-html-bridge-line="0" data-ngx-html-bridge-offset="0" data-test="hello"> ternary-operator\n</p>',
	);
	assert.strictEqual(
		result[2],
		'<p data-ngx-html-bridge-col="0" data-ngx-html-bridge-line="0" data-ngx-html-bridge-offset="0" data-test="hey"> ternary-operator\n</p>',
	);
});

test("Can parse template with @let", () => {
	const path = resolve("src/__tests__/let/let.component.html");
	const result = bridgeTemplateFile(path);
	assert.strictEqual(result.length, 1);
	assert.strictEqual(
		result[0],
		'<p data-ngx-html-bridge-col="0" data-ngx-html-bridge-line="2" data-ngx-html-bridge-offset="44" data-foo="Goodbye" data-bar="Hello, World!">let works!</p>',
	);
});
