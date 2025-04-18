import test from "node:test";
import assert from "node:assert";
import { resolve } from "node:path";
import { bridge } from "./bridge.ts";

test("Can parse template without control flow", () => {
	const path = resolve(
		"src/__tests__/no-control-flow/no-control-flow.component.html",
	);
	const result = bridge(path);
	assert.strictEqual(result.length, 1);
	assert.strictEqual(
		result[0],
		"<p>hello world</p><p>hello <span>Angular</span></p>",
	);
});

test("Can parse template with @if", () => {
	const path = resolve("src/__tests__/if/if.component.html");
	const result = bridge(path);

	assert.strictEqual(result.length, 4);
	assert.strictEqual(result[0], "<p>Both flagA and flagB are true</p>");
	assert.strictEqual(result[1], "<p>Both flagA and flagC are true</p>");
	assert.strictEqual(result[2], "<p>only flagA is true</p>");
	assert.strictEqual(result[3], "<p>flagA is false</p>");
});

test("Can parse template with @switch", () => {
	const path = resolve("src/__tests__/switch/switch.component.html");
	const result = bridge(path);

	assert.strictEqual(result.length, 3);
	assert.strictEqual(result[0], "<p>title is switch</p>");
	assert.strictEqual(result[1], "<p>title is switch2</p>");
	assert.strictEqual(result[2], "<p>title is not yet decided</p>");
});

test("Can parse template with @for", () => {
	const path = resolve("src/__tests__/for/for.component.html");
	const result = bridge(path);
	assert.strictEqual(result.length, 3);
	assert.strictEqual(result[0], "<li>There are no users.</li>");
	assert.strictEqual(result[1], "<li>{{ user.name }}</li>");
	assert.strictEqual(
		result[2],
		"<li>{{ user.name }}</li><li>{{ user.name }}</li>",
	);
});

test("Can parse template with @for without empty block", () => {
	const path = resolve(
		"src/__tests__/for-without-empty/for-without-empty.component.html",
	);
	const result = bridge(path);
	assert.strictEqual(result.length, 3);
	assert.strictEqual(result[0], "");
	assert.strictEqual(result[1], "<li>{{ user.name }}</li>");
	assert.strictEqual(
		result[2],
		"<li>{{ user.name }}</li><li>{{ user.name }}</li>",
	);
});
