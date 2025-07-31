import * as fs from "node:fs";

const spec = JSON.parse(
	fs.readFileSync("node_modules/@markuplint/html-spec/index.json", "utf-8"),
);

const attributes = new Set<string>();

// Extract global attributes
for (const group of Object.values(spec.def["#globalAttrs"])) {
	for (const attr of Object.keys(group as any)) {
		attributes.add(attr);
	}
}

// Extract ARIA attributes
const ariaProps = spec.def["#aria"]["1.3"].props;
const ariaAttrs = ariaProps.map((prop) => prop.name);
for (const attr of ariaAttrs) {
	attributes.add(attr);
}

// Extract element-specific attributes
for (const element of spec.specs) {
	if (element.attributes) {
		for (const attr of Object.keys(element.attributes)) {
			attributes.add(attr);
		}
	}
}

fs.writeFileSync(
	"src/core/html-spec/attributes.ts",
	`export const VALID_HTML_ATTRIBUTES = new Set(${JSON.stringify(Array.from(attributes))});`,
);
