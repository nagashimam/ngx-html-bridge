import { TmplAstElement, TmplAstTextAttribute } from "@angular/compiler";
import { Attr, TmplAstBranchNodeTransformer } from "../../types";
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
> = (element, tmplAstTemplates, transformTmplAstNodes) => {
	if (element.name === "ng-container") {
		return [...transformTmplAstNodes(element.children, tmplAstTemplates)];
	}
	const parsedElementNodes: Node[][] = [];

	const attribute2DArray = pairwiseAttributeNameAndValue(element.attributes);
	const children2DArray = transformTmplAstNodes(
		element.children,
		tmplAstTemplates,
	);

	for (const attributes of attribute2DArray) {
		for (const children of children2DArray) {
			const elementNode = document.createElement(element.name);
			for (const child of children) {
				elementNode.appendChild(child);
			}
			for (const attribute of attributes) {
				elementNode.setAttribute(attribute.name, attribute.value);
			}
			parsedElementNodes.push([elementNode]);
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
