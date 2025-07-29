import {
	ParsedTemplate,
	TmplAstBoundText,
	TmplAstDeferredBlock,
	TmplAstElement,
	TmplAstForLoopBlock,
	TmplAstIfBlock,
	TmplAstNode,
	TmplAstSwitchBlock,
	TmplAstTemplate,
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
import { transformTmplAstDeferredBlock } from "./defer";
import { transformTmplAstTemplate } from "./template";

export const transformParsedTemplate = (
	parsedTemplate: ParsedTemplate,
	tmplAstTemplates: TmplAstTemplate[],
): Node[][] => {
	return transformTmplAstNodes(parsedTemplate.nodes, tmplAstTemplates);
};

const transformTmplAstNodes: TransformTmplAstNodes = (
	astNodes,
	tmplAstTemplates,
) => {
	const parsed = astNodes.map((astNode) =>
		transformTmplAstNode(astNode, tmplAstTemplates),
	);
	return generate3DCombinations(parsed);
};

const transformTmplAstNode: TransformTmplAstNode<TmplAstNode> = (
	astNode,
	tmplAstTemplates,
) => {
	if (astNode instanceof TmplAstTemplate) {
		return transformTmplAstTemplate(
			astNode,
			tmplAstTemplates,
			transformTmplAstNodes,
		);
	}
	if (astNode instanceof TmplAstElement) {
		return transformTmplAstElement(
			astNode,
			tmplAstTemplates,
			transformTmplAstNodes,
		);
	}

	if (astNode instanceof TmplAstText) {
		return transformTmplAstText(astNode, tmplAstTemplates);
	}

	if (astNode instanceof TmplAstBoundText) {
		return transformTmplAstBoundText(astNode, tmplAstTemplates);
	}

	if (astNode instanceof TmplAstIfBlock) {
		return transformTmplAstIfBlock(
			astNode,
			tmplAstTemplates,
			transformTmplAstNodes,
		);
	}

	if (astNode instanceof TmplAstSwitchBlock) {
		return transformTmplAstSwitchBlock(
			astNode,
			tmplAstTemplates,
			transformTmplAstNodes,
		);
	}

	if (astNode instanceof TmplAstForLoopBlock) {
		return transformTmplAstForLoopBlock(
			astNode,
			tmplAstTemplates,
			transformTmplAstNodes,
		);
	}

	if (astNode instanceof TmplAstDeferredBlock) {
		return transformTmplAstDeferredBlock(
			astNode,
			tmplAstTemplates,
			transformTmplAstNodes,
		);
	}

	return [[]];
};
