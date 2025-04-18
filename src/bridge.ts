import { readFileSync } from "node:fs";
import {
	parseTemplate,
	TmplAstElement,
	TmplAstText,
	TmplAstIfBlock,
	TmplAstSwitchBlock,
	TmplAstForLoopBlock,
	TmplAstBoundText,
} from "@angular/compiler";
import type { ASTWithSource, TmplAstNode } from "@angular/compiler";
import { JSDOM } from "jsdom";

const dom = new JSDOM();
const window = dom.window;
const document = window.document;

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
		console.log(node);
		if (node.attributes.length > 0) {
			for (const attribute of node.attributes) {
				const { name, value } = attribute;
				element.setAttribute(name, value);
			}
		}

		if (node.inputs.length > 0) {
			for (const input of node.inputs) {
				const { name, value } = input;
				element.setAttribute(
					name,
					(value as ASTWithSource).source || "some random text",
				);
			}
		}

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
	if (node instanceof TmplAstForLoopBlock) {
		return parseForBlock(node);
	}
	if (node instanceof TmplAstText) {
		return [[document.createTextNode(node.value)]];
	}
	if (node instanceof TmplAstBoundText) {
		return [
			[
				document.createTextNode(
					(node.value as ASTWithSource).source || "some random text",
				),
			],
		];
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

const parseForBlock = (forBlock: TmplAstForLoopBlock): Node[][] => {
	const result: Node[][] = [];

	// Handle case for no loop
	if (forBlock.empty && forBlock.empty.children.length > 0) {
		for (const parsedEmptyBlock of parseAstNodes(forBlock.empty.children)) {
			result.push(parsedEmptyBlock);
		}
	} else {
		result.push([]);
	}

	// Handle case for loop once
	for (const parsedForBlock of parseAstNodes(forBlock.children)) {
		result.push(parsedForBlock);
	}

	// Handle case for loop twice
	for (const parsedForBlock of parseAstNodes([
		...forBlock.children,
		...forBlock.children,
	])) {
		result.push(parsedForBlock);
	}

	return result;
};
