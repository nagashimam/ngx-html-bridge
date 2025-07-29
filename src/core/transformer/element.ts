import { TmplAstElement } from "@angular/compiler";
import {
	TransformTmplAstNodeRecursivly,
	TransformTmplAstNodes,
} from "../../types";
import { document } from "../dom";

export const transformTmplAstElement: TransformTmplAstNodeRecursivly<
	TmplAstElement
> = (element: TmplAstElement, transformTmplAstNodes: TransformTmplAstNodes) => {
	const parsedElementNodes = [];

	const children2DArray = transformTmplAstNodes(element.children);
	for (const children of children2DArray) {
		const elementNode = document.createElement(element.name);
		for (const child of children) {
			elementNode.appendChild(child);
		}
		parsedElementNodes.push([elementNode]);
	}

	return parsedElementNodes;
};
