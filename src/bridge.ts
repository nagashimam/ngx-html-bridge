import { readFileSync } from "node:fs";
import { parseTemplate } from "@angular/compiler";
import { document } from "./dom.js";
import { parseAstNodes } from "./parser.js";
import { getPropertiesFromComponent } from "./properties.js";

export const bridge = (path: string): string[] => {
	// TODO: Add try-catch and handle errors
	const fileContents = readFileSync(path, "utf-8");
	const ast = parseTemplate(fileContents, path, {
		collectCommentNodes: true,
	});
	const properties = getPropertiesFromComponent(path);
	const parsedNodesCombinations = parseAstNodes(ast.nodes, properties);
	return parsedNodesCombinations.map((parsedNodesCombination) => {
		const container = document.createElement("div");
		for (const node of parsedNodesCombination) {
			container.append(node);
		}
		return container.innerHTML;
	});
};
