import type {
	ASTWithSource,
	TmplAstBoundAttribute,
	TmplAstElement,
	TmplAstTextAttribute,
} from "@angular/compiler";
import { parse, type TSESTree } from "@typescript-eslint/typescript-estree";
import type {
	Attr,
	BridgeOption,
	Properties,
	TmplAstBranchNodeTransformer,
} from "../../types/index.js";
import { document } from "../dom/index.js";
import { VALID_HTML_ATTRIBUTES } from "../html-spec/attributes.js";
import {
	castAST,
	castNode,
	isTSESTreeBinaryExpression,
	isTSESTreeCallExpression,
	isTSESTreeConditionalExpression,
	isTSESTreeIdentifier,
	isTSESTreeLiteral,
} from "../properties/utils.js";
import { generateAttrCombinations } from "./combination-generator.js";

export const attributeNames: string[] = [];

/**
 * Transforms a TmplAstElement node into a 2D array of DOM Nodes.
 * It handles `ng-container` elements by directly transforming their children.
 *
 * @param element The TmplAstElement node to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @param transformTmplAstNodes The recursive function to transform child AST nodes.
 * @returns A 2D array of DOM Nodes representing the transformed element.
 */
export const transformTmplAstElement: TmplAstBranchNodeTransformer<
	TmplAstElement
> = async (
	element,
	tmplAstTemplates,
	properties,
	transformTmplAstNodes,
	option,
) => {
	if (element.name === "ng-container") {
		return [
			...(await transformTmplAstNodes(
				element.children,
				tmplAstTemplates,
				properties,
				option,
			)),
		];
	}
	const parsedElementNodes: Node[][] = [];

	const properties2DArray = pairwisePropertyNameAndValue(
		element.inputs,
		properties,
		option,
	);
	const attribute2DArray = pairwiseAttributeNameAndValue(
		element.attributes,
		option,
	);
	const children2DArray = await transformTmplAstNodes(
		element.children,
		tmplAstTemplates,
		properties,
		option,
	);

	for (const props of properties2DArray) {
		for (const attributes of attribute2DArray) {
			for (const children of children2DArray) {
				const elementNode = document.createElement(element.name);
				elementNode.setAttribute(
					"data-ngx-html-bridge-line",
					element.sourceSpan.start.line.toString(),
				);
				elementNode.setAttribute(
					"data-ngx-html-bridge-col",
					element.sourceSpan.start.col.toString(),
				);
				elementNode.setAttribute(
					"data-ngx-html-bridge-start-offset",
					element.sourceSpan.start.offset.toString(),
				);
				elementNode.setAttribute(
					"data-ngx-html-bridge-end-offset",
					element.sourceSpan.end.offset.toString(),
				);
				for (const child of children) {
					elementNode.appendChild(child.cloneNode(true));
				}
				for (const attribute of attributes) {
					const value = attribute.value;
					if (!(value === null || value === undefined)) {
						attributeNames.push(attribute.name);
						elementNode.setAttribute(
							`data-ngx-html-bridge-${attribute.name}-start-offset`,
							attribute.sourceSpan.start.offset.toString(),
						);
						elementNode.setAttribute(
							`data-ngx-html-bridge-${attribute.name}-end-offset`,
							attribute.sourceSpan.end.offset.toString(),
						);
						elementNode.setAttribute(attribute.name, value);
					}
				}
				for (const prop of props) {
					const value = prop.value;
					if (!(value === null || value === undefined)) {
						attributeNames.push(prop.name);
						elementNode.setAttribute(
							`data-ngx-html-bridge-${prop.name}-start-offset`,
							prop.sourceSpan.start.offset.toString(),
						);
						elementNode.setAttribute(
							`data-ngx-html-bridge-${prop.name}-end-offset`,
							prop.sourceSpan.end.offset.toString(),
						);
						elementNode.setAttribute(prop.name, value);
					}
				}
				parsedElementNodes.push([elementNode]);
			}
		}
	}

	return parsedElementNodes;
};

/**
 * Extracts standard HTML attributes from a list of TmplAstTextAttribute nodes.
 * It filters out attributes that are not considered valid HTML attributes.
 *
 * @param tmplAstTextAttributes An array of TmplAstTextAttribute nodes.
 * @returns A 2D array containing a single array of Attr objects, representing the valid HTML attributes.
 */
const pairwiseAttributeNameAndValue = (
	tmplAstTextAttributes: TmplAstTextAttribute[],
	option: BridgeOption,
): Attr[][] => {
	const attributesOrInputs = tmplAstTextAttributes.map((attr) => ({
		name: attr.name,
		value: attr.value,
		sourceSpan: attr.sourceSpan,
	}));
	const attributes = attributesOrInputs.filter(
		(attributeOrInput) =>
			VALID_HTML_ATTRIBUTES.has(attributeOrInput.name) ||
			option.includedAttributes
				?.map((attr) => new RegExp(attr))
				.find((regex) => regex.test(attributeOrInput.name)),
	);
	return [[...attributes]];
};

/**
 * Extracts property names and their resolved values from TmplAstBoundAttribute nodes.
 * It filters for valid HTML attributes and resolves their values using the component's properties.
 *
 * @param tmplAstBoundAttributes An array of TmplAstBoundAttribute nodes.
 * @param properties A map of component properties and their resolved values.
 * @returns A 2D array of Attr objects, representing all possible combinations of resolved attribute values.
 */
const pairwisePropertyNameAndValue = (
	tmplAstBoundAttributes: TmplAstBoundAttribute[],
	properties: Properties,
	option: BridgeOption,
): Attr[][] => {
	const listOfPossibleAttributeValues: Attr[][] = tmplAstBoundAttributes
		.filter(
			(attributeOrInput) =>
				VALID_HTML_ATTRIBUTES.has(attributeOrInput.name) ||
				option.includedAttributes?.includes(attributeOrInput.name),
		)
		.filter((attribute) => {
			const details = attribute.keySpan.details;
			if (!details) {
				return true;
			}
			return !(details.includes("class.") || details.includes("style."));
		})
		.map((attr) => {
			try {
				const rawSource = castAST<ASTWithSource>(attr.value).source || "";
				//  Convert foo{{bar}} in <p id="foo{{bar}}"> to 'foo' + bar
				const source = rawSource
					.replace(/\}\}(.*)\{\{/g, "}} + '$1' + {{")
					.replace(/^(.*?)\{\{/, "'$1' + {{")
					.replace(/\{\{(.*?)\}\}/g, "$1");
				const body = parse(source.replace(/(.*)\{\{(.*)\}\}/, "'$1' + $2"))
					.body[0];
				const expression =
					castNode<TSESTree.ExpressionStatement>(body).expression;
				const values = parseExpressionIntoLiterals(expression, properties);
				return values.map((value) => ({
					name: attr.name,
					value,
					sourceSpan: attr.sourceSpan,
				}));
			} catch {
				return [
					{
						name: attr.name,
						value: "some-random-value",
						sourceSpan: attr.sourceSpan,
					},
				];
			}
		})
		.filter((attr) => !!attr);
	return generateAttrCombinations(listOfPossibleAttributeValues);
};

/**
 * Parses a TypeScript AST expression into a list of possible literal values.
 * Handles conditional (ternary) expressions, literal values, and identifiers.
 * Unresolved identifiers or unsupported expressions will result in a placeholder value.
 *
 * @param expression The TypeScript AST expression to parse.
 * @param properties A map of component properties and their resolved values.
 * @returns An array of possible string, undefined, or null literal values.
 */
const parseExpressionIntoLiterals = (
	expression: TSESTree.Node,
	properties: Properties,
): (string | undefined | null)[] => {
	if (isTSESTreeConditionalExpression(expression)) {
		const { consequent, alternate } =
			castNode<TSESTree.ConditionalExpression>(expression);
		return [
			...parseExpressionIntoLiterals(consequent, properties),
			...parseExpressionIntoLiterals(alternate, properties),
		];
	}

	if (isTSESTreeLiteral(expression)) {
		const literal = castNode<TSESTree.Literal>(expression);
		if (literal.raw === "null") {
			return [null];
		}
		const literalValue = literal.value?.toString();
		return [literalValue || ""];
	}

	if (isTSESTreeIdentifier(expression)) {
		const name = castNode<TSESTree.Identifier>(expression).name || "";
		if (name === "undefined") {
			return [undefined];
		}
		return [properties.get(name) || "some-random-value"];
	}

	if (isTSESTreeCallExpression(expression)) {
		const callee = castNode<TSESTree.CallExpression>(expression).callee;
		return parseExpressionIntoLiterals(callee, properties);
	}

	if (isTSESTreeBinaryExpression(expression)) {
		const binaryExpression = castNode<TSESTree.BinaryExpression>(expression);
		if (binaryExpression.operator === "+") {
			// It doesn't make sense to apply "+" operator to null or undefined, so it's safe to filter
			const left = parseExpressionIntoLiterals(
				binaryExpression.left,
				properties,
			).filter((operand) => !!operand);
			const right = parseExpressionIntoLiterals(
				binaryExpression.right,
				properties,
			).filter((operand) => !!operand);

			const result: string[] = [];
			for (const leftOperand of left) {
				for (const rightOperand of right) {
					result.push(leftOperand!.toString() + rightOperand!.toString());
				}
			}
			return result;
		}
	}

	return ["some-random-value"];
};
