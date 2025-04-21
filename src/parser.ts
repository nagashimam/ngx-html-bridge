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
import type { Properties, ParsedAttr } from "./types.ts";
import {
	generate3DCombinations,
	generateCombinations,
} from "./combinations.ts";
import { parse, TSESTree } from "@typescript-eslint/typescript-estree";

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

	const attrsCombinations: ParsedAttr[][] = generateCombinations(
		elementNode.inputs.map((input) => {
			const { name, value } = input;
			const source = (value as ASTWithSource).source || "";
			// TODO: Consider if body's length could be more than 1.
			const body = parse(source).body[0];
			const expression = (body as TSESTree.ExpressionStatement).expression;
			const values = parseExpressionIntoLiterals(expression, properties);
			return { name, values };
		}),
	);
	const parsedElementsCombinations = parseElementChildren(
		element,
		elementNode,
		properties,
	);
	const result: Node[][] = [];
	for (const attrs of attrsCombinations) {
		for (const parsedElements of parsedElementsCombinations) {
			// There should be only one element in parsedElements
			for (const parsedElement of parsedElements) {
				const clonedElement = parsedElement.cloneNode(true) as Element;
				for (const attribute of attrs) {
					clonedElement.setAttribute(attribute.name, attribute.value);
				}
				result.push([clonedElement]);
			}
		}
	}

	return result;
};

const parseElementChildren = (
	element: Element,
	elementNode: TmplAstElement,
	properties: Properties,
): Node[][] => {
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

const parseExpressionIntoLiterals = (
	expression: TSESTree.Expression,
	properties: Properties,
): string[] => {
	if (
		(expression.type as string) ===
		TSESTree.AST_NODE_TYPES.ConditionalExpression
	) {
		const { consequent, alternate } =
			expression as unknown as TSESTree.ConditionalExpression;
		return [
			...parseExpressionIntoLiterals(consequent, properties),
			...parseExpressionIntoLiterals(alternate, properties),
		];
	}

	if ((expression.type as string) === TSESTree.AST_NODE_TYPES.Literal) {
		return [
			(expression as unknown as TSESTree.Literal).value?.toString() ||
				"some random value",
		];
	}

	if ((expression.type as string) === TSESTree.AST_NODE_TYPES.Identifier) {
		const name = (expression as unknown as TSESTree.Identifier).name || "";
		return [properties.get(name) || "some random value"];
	}

	return [];
};
