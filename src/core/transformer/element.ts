import { TmplAstElement } from "@angular/compiler";
import { TransformTmplAstNodeRecursivly } from "../../types";
import { document } from "../dom";

export const transformTmplAstElement: TransformTmplAstNodeRecursivly<
	TmplAstElement
> = (element, tmplAstTemplates, transformTmplAstNodes) => {
	if (element.name === "ng-container") {
		return [...transformTmplAstNodes(element.children, tmplAstTemplates)];
	}
	const parsedElementNodes = [];

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
