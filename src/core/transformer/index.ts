import {
	ParsedTemplate,
	TmplAstElement,
	TmplAstNode,
	TmplAstText,
} from "@angular/compiler";

import { transformTmplAstText } from "./text";
import { TransformTmplAstNode, TransformTmplAstNodes } from "../../types";
import { transformTmplAstElement } from "./element";
import { generate3DCombinations } from "./cartesian-product";

export const transformParsedTemplate = (
	parsedTemplate: ParsedTemplate,
): Node[][] => {
	return transformTmplAstNodes(parsedTemplate.nodes);
};

const transformTmplAstNodes: TransformTmplAstNodes = (astNodes) => {
	const parsed = astNodes.map((astNode) => transformTmplAstNode(astNode));
	return generate3DCombinations(parsed);
};

const transformTmplAstNode: TransformTmplAstNode<TmplAstNode> = (astNode) => {
	if (astNode instanceof TmplAstElement) {
		return transformTmplAstElement(astNode, transformTmplAstNodes);
	}

	if (astNode instanceof TmplAstText) {
		return transformTmplAstText(astNode);
	}

	return [];
};
