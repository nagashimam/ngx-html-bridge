import { TmplAstElement } from "@angular/compiler";
import { RecursiveTmplAstNodeTransformer } from "../../types";
import { document } from "../dom";

/**
 * Transforms a TmplAstElement node into a 2D array of DOM Nodes.
 * It handles `ng-container` elements by directly transforming their children.
 *
 * @param element The TmplAstElement node to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @param transformTmplAstNodes The recursive function to transform child AST nodes.
 * @returns A 2D array of DOM Nodes representing the transformed element.
 */
export const transformTmplAstElement: RecursiveTmplAstNodeTransformer<
	TmplAstElement
> = (element, tmplAstTemplates, transformTmplAstNodes) => {
	if (element.name === "ng-container") {
		return [...transformTmplAstNodes(element.children, tmplAstTemplates)];
	}
	const parsedElementNodes: Node[][] = [];

	const children2DArray = transformTmplAstNodes(
		element.children,
		tmplAstTemplates,
	);
	for (const children of children2DArray) {
		const elementNode = document.createElement(element.name);
		for (const child of children) {
			elementNode.appendChild(child);
		}
		parsedElementNodes.push([elementNode]);
	}

	return parsedElementNodes;
};
