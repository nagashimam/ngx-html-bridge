import {
	AST,
	ASTWithSource,
	LiteralPrimitive,
	PropertyRead,
	TmplAstBoundAttribute,
	TmplAstElement,
	TmplAstTextAttribute,
} from "@angular/compiler";
import { Attr, Properties, TmplAstBranchNodeTransformer } from "../../types";
import { document } from "../dom";
import { VALID_HTML_ATTRIBUTES } from "../html-spec/attributes";

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
> = (element, tmplAstTemplates, properties, transformTmplAstNodes) => {
	if (element.name === "ng-container") {
		return [
			...transformTmplAstNodes(element.children, tmplAstTemplates, properties),
		];
	}
	const parsedElementNodes: Node[][] = [];

	const properties2DArray = pairwisePropertyNameAndValue(
		element.inputs,
		properties,
	);
	const attribute2DArray = pairwiseAttributeNameAndValue(element.attributes);
	const children2DArray = transformTmplAstNodes(
		element.children,
		tmplAstTemplates,
		properties,
	);

	for (const props of properties2DArray) {
		for (const attributes of attribute2DArray) {
			for (const children of children2DArray) {
				const elementNode = document.createElement(element.name);
				for (const child of children) {
					elementNode.appendChild(child);
				}
				for (const attribute of attributes) {
					elementNode.setAttribute(attribute.name, attribute.value);
				}
				for (const prop of props) {
					elementNode.setAttribute(prop.name, prop.value);
				}
				parsedElementNodes.push([elementNode]);
			}
		}
	}

	return parsedElementNodes;
};

const pairwiseAttributeNameAndValue = (
	tmplAstTextAttributes: TmplAstTextAttribute[],
): Attr[][] => {
	const attributesOrInputs = tmplAstTextAttributes.map((attr) => ({
		name: attr.name,
		value: attr.value,
	}));
	const attributes = attributesOrInputs.filter((attributeOrInput) =>
		VALID_HTML_ATTRIBUTES.has(attributeOrInput.name),
	);
	return [[...attributes]];
};

const pairwisePropertyNameAndValue = (
	tmplAstBoundAttributes: TmplAstBoundAttribute[],
	properties: Properties,
): Attr[][] => {
	const attributes = tmplAstBoundAttributes.map((attr) => {
		const name = attr.name;
		const value = extractValueFromSource(attr.value, properties);
		return {
			name,
			value,
		};
	});
	const filteredAttributes = attributes.filter((attributeOrInput) =>
		VALID_HTML_ATTRIBUTES.has(attributeOrInput.name),
	);
	return [[...filteredAttributes]];
};

const extractValueFromSource = (ast: AST, properties: Properties) => {
	if (!(ast instanceof ASTWithSource)) {
		return "some random value";
	}

	if (ast.ast instanceof PropertyRead) {
		return properties.get(ast.ast.name) || "some random value";
	}
	if (ast.ast instanceof LiteralPrimitive) {
		return ast.ast.value.toString();
	}

	return "some random value";
};
