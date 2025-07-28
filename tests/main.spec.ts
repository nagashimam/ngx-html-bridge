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
