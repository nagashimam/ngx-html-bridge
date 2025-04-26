import {
	TmplAstElement,
	TmplAstText,
	TmplAstIfBlock,
	TmplAstSwitchBlock,
	TmplAstForLoopBlock,
	TmplAstBoundText,
	TmplAstLetDeclaration,
	LiteralPrimitive,
	PropertyRead,
} from "@angular/compiler";
import type { ASTWithSource, TmplAstNode } from "@angular/compiler";
import { document } from "./dom.ts";
import type { Properties, ParsedAttr } from "./types.ts";
import {
	generate3DCombinations,
	generateCombinations,
} from "./combinations.ts";
import { parse } from "@typescript-eslint/typescript-estree";
import type { TSESTree } from "@typescript-eslint/typescript-estree";
import {
	castAST,
	castNode,
	isTSESTreeConditionalExpression,
	isTSESTreeIdentifier,
	isTSESTreeLiteral,
} from "./utils.ts";

export const parseAstNodes = (nodes: TmplAstNode[], properties: Properties) => {
	const parsedNodes: Node[][][] = [];
	for (const node of nodes) {
		if (node instanceof TmplAstLetDeclaration) {
			const name = node.name;
			const source = castAST<ASTWithSource>(node.value);
			const ast = source.ast;
			if (ast instanceof LiteralPrimitive) {
				properties.set(name, ast.value);
			}
			if (ast instanceof PropertyRead) {
				const value = properties.get(ast.name);
				if (value !== undefined) {
					properties.set(name, value);
				}
			}
		} else {
			parsedNodes.push(parseEachNode(node, properties));
		}
	}

	return generate3DCombinations(parsedNodes);
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
					castAST<ASTWithSource>(node.value).source || "some random text",
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
	const startSourceSpan = elementNode.sourceSpan.start;
	const { col, line, offset } = startSourceSpan;
	const originalAttrPrefix = "data-ngx-html-bridge";
	element.setAttribute(`${originalAttrPrefix}-col`, col.toString());
	element.setAttribute(`${originalAttrPrefix}-line`, line.toString());
	element.setAttribute(`${originalAttrPrefix}-offset`, offset.toString());
	if (elementNode.attributes.length > 0) {
		for (const attribute of elementNode.attributes) {
			const { name, value } = attribute;
			element.setAttribute(name, value);
		}
	}

	const attrsCombinations: ParsedAttr[][] = generateCombinations(
		elementNode.inputs.map((input) => {
			const { name, value } = input;
			const source = castAST<ASTWithSource>(value).source || "";
			// TODO: Consider if body's length could be more than 1.
			const body = parse(source).body[0];
			const expression =
				castNode<TSESTree.ExpressionStatement>(body).expression;
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

// TODO: If array is literal value or element in properties, you know exactly how many times the block loops
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
	if (isTSESTreeConditionalExpression(expression)) {
		const { consequent, alternate } =
			castNode<TSESTree.ConditionalExpression>(expression);
		return [
			...parseExpressionIntoLiterals(consequent, properties),
			...parseExpressionIntoLiterals(alternate, properties),
		];
	}

	if (isTSESTreeLiteral(expression)) {
		const literalValue =
			castNode<TSESTree.Literal>(expression).value?.toString();
		return [literalValue || "some random value"];
	}

	if (isTSESTreeIdentifier(expression)) {
		const name = castNode<TSESTree.Identifier>(expression).name || "";
		return [properties.get(name) || "some random value"];
	}

	return [];
};
