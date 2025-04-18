import { readFileSync } from "node:fs";
import { parseTemplate } from "@angular/compiler";
import { document } from "./dom.ts";
import { parseAstNodes } from "./parse.ts";

export const bridge = (path: string): string[] => {
	// TODO: Add try-catch and handle errors
	const fileContents = readFileSync(path, "utf-8");
	const ast = parseTemplate(fileContents, path, {
		collectCommentNodes: true,
	});
	const parsedNodesCombinations = parseAstNodes(ast.nodes);
	return parsedNodesCombinations.map((parsedNodesCombination) => {
		const container = document.createElement("div");
		for (const node of parsedNodesCombination) {
			container.append(node);
		}
		return container.innerHTML;
	});
};
