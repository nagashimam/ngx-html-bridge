import {
	TmplAstElement,
	TmplAstText,
	TmplAstIfBlock,
	TmplAstSwitchBlock,
	TmplAstForLoopBlock,
	TmplAstBoundText,
} from "@angular/compiler";
import type { ASTWithSource, TmplAstNode } from "@angular/compiler";
import { document } from "./dom.ts";
import type { Properties } from "./types.ts";

export const parseAstNodes = (nodes: TmplAstNode[], properties: Properties) => {
	const parsedNodes = generate3DCombinations(
		nodes.map((node) => parseEachNode(node, properties)),
	);
	return parsedNodes;
};

const parseEachNode = (node: TmplAstNode, properties: Properties): Node[][] => {
	if (node instanceof TmplAstElement) {
		return parseElement(node, properties);
	}
	if (node instanceof TmplAstIfBlock) {
		return parseIfBlock(node, properties);
	}
	if (node instanceof TmplAstSwitchBlock) {
		return parseSwitchBlock(node, properties);
	}
	if (node instanceof TmplAstForLoopBlock) {
		return parseForBlock(node, properties);
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

const parseElement = (
	elementNode: TmplAstElement,
	properties: Properties,
): Node[][] => {
	const name = elementNode.name;
	const element = document.createElement(name);
	if (elementNode.attributes.length > 0) {
		for (const attribute of elementNode.attributes) {
			const { name, value } = attribute;
			element.setAttribute(name, value);
		}
	}

	if (elementNode.inputs.length > 0) {
		for (const input of elementNode.inputs) {
			const { name, value } = input;
			const source = (value as ASTWithSource).source || "";
			const computedValue = properties.get(source) || "some random text";
			element.setAttribute(name, computedValue);
		}
	}

	if (elementNode.children.length > 0) {
		const childrenCombinations = parseAstNodes(
			elementNode.children,
			properties,
		);
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
};

const parseIfBlock = (
	ifBlock: TmplAstIfBlock,
	properties: Properties,
): Node[][] => {
	const parsedBranches = ifBlock.branches.map((branch) =>
		parseAstNodes(branch.children, properties),
	);
	const result: Node[][] = [];
	for (const branch of parsedBranches) {
		result.push(...branch);
	}
	return result;
};

const parseSwitchBlock = (
	switchBlock: TmplAstSwitchBlock,
	properties: Properties,
): Node[][] => {
	const parsedCases = switchBlock.cases.map((caseBlock) =>
		parseAstNodes(caseBlock.children, properties),
	);
	const result: Node[][] = [];
	for (const branch of parsedCases) {
		result.push(...branch);
	}
	return result;
};

const parseForBlock = (
	forBlock: TmplAstForLoopBlock,
	properties: Properties,
): Node[][] => {
	const result: Node[][] = [];

	// Handle case for no loop
	if (forBlock.empty && forBlock.empty.children.length > 0) {
		for (const parsedEmptyBlock of parseAstNodes(
			forBlock.empty.children,
			properties,
		)) {
			result.push(parsedEmptyBlock);
		}
	} else {
		result.push([]);
	}

	// Handle case for loop once
	for (const parsedForBlock of parseAstNodes(forBlock.children, properties)) {
		result.push(parsedForBlock);
	}

	// Handle case for loop twice
	for (const parsedForBlock of parseAstNodes(
		[...forBlock.children, ...forBlock.children],
		properties,
	)) {
		result.push(parsedForBlock);
	}

	return result;
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
