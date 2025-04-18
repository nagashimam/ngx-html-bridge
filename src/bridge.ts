import { readFileSync } from "node:fs";
import {
	parseTemplate,
	TmplAstElement,
	TmplAstText,
	TmplAstIfBlock,
	TmplAstSwitchBlock,
} from "@angular/compiler";
import type { TmplAstNode } from "@angular/compiler";
import { JSDOM } from "jsdom";

const dom = new JSDOM();
const window = dom.window;
const document = window.document;

export const bridge = (path: string): string[] => {
	// TODO: Add try-catch and handle errors
	const fileContents = readFileSync(path, "utf-8");
	const ast = parseTemplate(fileContents, path);
	const parsedNodesCombinations = parseAstNodes(ast.nodes);
	return parsedNodesCombinations.map((parsedNodesCombination) => {
		const container = document.createElement("div");
		for (const node of parsedNodesCombination) {
			container.append(node);
		}
		return container.innerHTML;
	});
};

const parseAstNodes = (nodes: TmplAstNode[]) => {
	const parsedNodes = generate3DCombinations(
		nodes.map((node) => parseEachNode(node)),
	);
	return parsedNodes;
};

const parseEachNode = (node: TmplAstNode): Node[][] => {
	if (node instanceof TmplAstElement) {
		const name = node.name;
		const element = document.createElement(name);

		if (node.children.length > 0) {
			const childrenCombinations = parseAstNodes(node.children);
			return [
				childrenCombinations.map((childrenCombination) => {
					const clonedElement = element.cloneNode(true) as Element;
					for (const child of childrenCombination) {
						clonedElement.append(child);
					}
					return clonedElement;
				}),
			];
		}
		return [[element]];
	}
	if (node instanceof TmplAstIfBlock) {
		return parseIfBlock(node);
	}
	if (node instanceof TmplAstSwitchBlock) {
		return parseSwitchBlock(node);
	}
	if (node instanceof TmplAstText) {
		return [[document.createTextNode(node.value)]];
	}
	return [[]];
};

// Generate all combinations of 3-D array of nodes
// Example: Takes [[[div#1]],[[div#2]],[[div#3],[div#4,div#5]]] and outputs [[div#1,div#2,div#3],[div#1,div#2,div#4,div#5]]
const generate3DCombinations = (arrays: Node[][][]): Node[][] => {
	const result: Node[][] = [];

	function backtrack(index: number, current: Node[]) {
		if (index === arrays.length) {
			result.push([...current]);
			return;
		}

		for (const subArray of arrays[index]) {
			for (const value of subArray) {
				current.push(value);
			}
			backtrack(index + 1, current);
			for (let i = 0; i < subArray.length; i++) {
				current.pop();
			}
		}
	}

	backtrack(0, []);
	return result;
};

const parseIfBlock = (ifBlock: TmplAstIfBlock): Node[][] => {
	const parsedBranches = ifBlock.branches.map((branch) =>
		parseAstNodes(branch.children),
	);
	const result: Node[][] = [];
	for (const branch of parsedBranches) {
		result.push(...branch);
	}
	return result;
};

const parseSwitchBlock = (switchBlock: TmplAstSwitchBlock): Node[][] => {
	const parsedCases = switchBlock.cases.map((caseBlock) =>
		parseAstNodes(caseBlock.children),
	);
	const result: Node[][] = [];
	for (const branch of parsedCases) {
		result.push(...branch);
	}
	return result;
};
