import {
	ParsedTemplate,
	TmplAstBoundText,
	TmplAstElement,
	TmplAstForLoopBlock,
	TmplAstIfBlock,
	TmplAstNode,
	TmplAstSwitchBlock,
	TmplAstText,
} from "@angular/compiler";

import { transformTmplAstText } from "./text";
import { TransformTmplAstNode, TransformTmplAstNodes } from "../../types";
import { transformTmplAstElement } from "./element";
import { generate3DCombinations } from "./cartesian-product";
import { transformTmplAstIfBlock } from "./if";
import { transformTmplAstSwitchBlock } from "./switch";
import { transformTmplAstForLoopBlock } from "./for";
import { transformTmplAstBoundText } from "./bound-text";

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

	if (astNode instanceof TmplAstBoundText) {
		return transformTmplAstBoundText(astNode);
	}

	if (astNode instanceof TmplAstIfBlock) {
		return transformTmplAstIfBlock(astNode, transformTmplAstNodes);
	}

	if (astNode instanceof TmplAstSwitchBlock) {
		return transformTmplAstSwitchBlock(astNode, transformTmplAstNodes);
	}

	if (astNode instanceof TmplAstForLoopBlock) {
		return transformTmplAstForLoopBlock(astNode, transformTmplAstNodes);
	}

	return [[]];
};
