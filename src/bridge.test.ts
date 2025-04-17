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
