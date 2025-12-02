import type {
	ParsedTemplate,
	TmplAstTemplate as Template,
} from "@angular/compiler";
import {
	TmplAstBoundText,
	TmplAstDeferredBlock,
	TmplAstElement,
	TmplAstForLoopBlock,
	TmplAstIfBlock,
	TmplAstSwitchBlock,
	TmplAstTemplate,
	TmplAstText,
} from "@angular/compiler";
import type {
	BridgeOption,
	TmplAstNodeDispatcher,
	TmplAstNodeMetadata,
	TmplAstNodesTransformer,
} from "../../types/index.js";
import { transformTmplAstBoundText } from "./bound-text.js";
import { generateCombinations } from "./combination-generator.js";
import { transformTmplAstDeferredBlock } from "./defer.js";
import { transformTmplAstElement } from "./element.js";
import { transformTmplAstForLoopBlock } from "./for.js";
import { transformTmplAstIfBlock } from "./if.js";
import { transformTmplAstSwitchBlock } from "./switch.js";
import { transformTmplAstTemplate } from "./template.js";
import { transformTmplAstText } from "./text.js";

/**
 * Transforms a ParsedTemplate object into a 2D array of DOM Nodes.
 *
 * @param parsedTemplate The ParsedTemplate object to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @returns A 2D array of DOM Nodes representing the transformed template.
 */
export const transformParsedTemplate = (
	parsedTemplate: ParsedTemplate,
	tmplAstTemplates: Template[],
	metadata: TmplAstNodeMetadata,
	option: BridgeOption,
) => {
	return transformTmplAstNodes(
		parsedTemplate.nodes,
		tmplAstTemplates,
		metadata,
		option,
	);
};

/**
 * Transforms an array of TmplAstNode objects into a 2D array of DOM Nodes.
 *
 * @param astNodes The array of TmplAstNode objects to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @returns A 2D array of DOM Nodes representing the transformed AST nodes.
 */
const transformTmplAstNodes: TmplAstNodesTransformer = async (
	astNodes,
	tmplAstTemplates,
	metadata,
	option,
) => {
	const parsed = astNodes.map((astNode) =>
		transformTmplAstNode(astNode, tmplAstTemplates, metadata, option),
	);
	return generateCombinations(await Promise.all(parsed));
};

/**
 * Transforms a single TmplAstNode object into a 2D array of DOM Nodes.
 *
 * @param astNode The TmplAstNode object to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @returns A 2D array of DOM Nodes representing the transformed AST node.
 */
const transformTmplAstNode: TmplAstNodeDispatcher = async (
	astNode,
	tmplAstTemplates,
	metadata,
	option,
) => {
	if (astNode instanceof TmplAstIfBlock) {
		return transformTmplAstIfBlock(
			astNode,
			tmplAstTemplates,

			metadata,
			transformTmplAstNodes,
			option,
		);
	}

	if (astNode instanceof TmplAstSwitchBlock) {
		return transformTmplAstSwitchBlock(
			astNode,
			tmplAstTemplates,
			metadata,
			transformTmplAstNodes,
			option,
		);
	}

	if (astNode instanceof TmplAstForLoopBlock) {
		return transformTmplAstForLoopBlock(
			astNode,
			tmplAstTemplates,
			metadata,
			transformTmplAstNodes,
			option,
		);
	}

	if (astNode instanceof TmplAstDeferredBlock) {
		return transformTmplAstDeferredBlock(
			astNode,
			tmplAstTemplates,
			metadata,
			transformTmplAstNodes,
			option,
		);
	}

	if (astNode instanceof TmplAstTemplate) {
		return transformTmplAstTemplate(
			astNode,
			tmplAstTemplates,
			metadata,
			transformTmplAstNodes,
			option,
		);
	}

	if (astNode instanceof TmplAstElement) {
		return transformTmplAstElement(
			astNode,
			tmplAstTemplates,
			metadata,
			transformTmplAstNodes,
			option,
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
