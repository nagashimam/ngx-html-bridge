import { readFileSync } from "node:fs";
import { parseTemplate } from "@angular/compiler";
import { document } from "./dom.js";
import { parseAstNodes } from "./parser.js";
import { getPropertiesFromComponent } from "./properties.js";

export const bridgeTemplateFile = (path: string): string[] => {
	// TODO: Add try-catch and handle errors
	const template = readFileSync(path, "utf-8");
	return bridgeTemplate(template, path);
};

export const bridgeTemplate = (template: string, path: string): string[] => {
	const ast = parseTemplate(template, path, {
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
