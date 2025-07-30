import {
	ParsedTemplate,
	TmplAstBoundText,
	TmplAstDeferredBlock,
	TmplAstElement,
	TmplAstForLoopBlock,
	TmplAstIfBlock,
	TmplAstSwitchBlock,
	TmplAstTemplate,
	TmplAstText,
} from "@angular/compiler";

import { transformTmplAstText } from "./text";
import { TmplAstNodesTransformer, TmplAstNodeDispatcher } from "../../types";
import { transformTmplAstElement } from "./element";
import { generate3DCombinations } from "./cartesian-product";
import { transformTmplAstIfBlock } from "./if";
import { transformTmplAstSwitchBlock } from "./switch";
import { transformTmplAstForLoopBlock } from "./for";
import { transformTmplAstBoundText } from "./bound-text";
import { transformTmplAstDeferredBlock } from "./defer";
import { transformTmplAstTemplate } from "./template";

/**
 * Transforms a ParsedTemplate object into a 2D array of DOM Nodes.
 *
 * @param parsedTemplate The ParsedTemplate object to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @returns A 2D array of DOM Nodes representing the transformed template.
 */
export const transformParsedTemplate = (
	parsedTemplate: ParsedTemplate,
	tmplAstTemplates: TmplAstTemplate[],
): Node[][] => {
	return transformTmplAstNodes(parsedTemplate.nodes, tmplAstTemplates);
};

/**
 * Transforms an array of TmplAstNode objects into a 2D array of DOM Nodes.
 *
 * @param astNodes The array of TmplAstNode objects to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @returns A 2D array of DOM Nodes representing the transformed AST nodes.
 */
const transformTmplAstNodes: TmplAstNodesTransformer = (
	astNodes,
	tmplAstTemplates,
) => {
	const parsed = astNodes.map((astNode) =>
		transformTmplAstNode(astNode, tmplAstTemplates),
	);
	return generate3DCombinations(parsed);
};

/**
 * Transforms a single TmplAstNode object into a 2D array of DOM Nodes.
 *
 * @param astNode The TmplAstNode object to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @returns A 2D array of DOM Nodes representing the transformed AST node.
 */
const transformTmplAstNode: TmplAstNodeDispatcher = (
	astNode,
	tmplAstTemplates,
) => {
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
		return transformTmplAstText(astNode);
	}

	if (astNode instanceof TmplAstBoundText) {
		return transformTmplAstBoundText(astNode);
	}

	return [[]];
};
