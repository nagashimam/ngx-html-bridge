import type {
	ParsedTemplate,
	TmplAstTemplate as Template,
} from "@angular/compiler";
import type {
	Properties,
	TmplAstNodeDispatcher,
	TmplAstNodesTransformer,
} from "../../types";
import { transformTmplAstBoundText } from "./bound-text";
import { generateCombinations } from "./combination-generator";
import { transformTmplAstDeferredBlock } from "./defer";
import { transformTmplAstElement } from "./element";
import { transformTmplAstForLoopBlock } from "./for";
import { transformTmplAstIfBlock } from "./if";
import { transformTmplAstSwitchBlock } from "./switch";
import { transformTmplAstTemplate } from "./template";
import { transformTmplAstText } from "./text";

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
	properties: Properties,
) => {
	return transformTmplAstNodes(
		parsedTemplate.nodes,
		tmplAstTemplates,
		properties,
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
	properties,
) => {
	const parsed = astNodes.map((astNode) =>
		transformTmplAstNode(astNode, tmplAstTemplates, properties),
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
	properties,
) => {
	const {
		TmplAstBoundText,
		TmplAstDeferredBlock,
		TmplAstElement,
		TmplAstForLoopBlock,
		TmplAstIfBlock,
		TmplAstSwitchBlock,
		TmplAstTemplate,
		TmplAstText,
	} = await import("@angular/compiler");

	if (astNode instanceof TmplAstIfBlock) {
		return transformTmplAstIfBlock(
			astNode,
			tmplAstTemplates,

			properties,
			transformTmplAstNodes,
		);
	}

	if (astNode instanceof TmplAstSwitchBlock) {
		return transformTmplAstSwitchBlock(
			astNode,
			tmplAstTemplates,
			properties,
			transformTmplAstNodes,
		);
	}

	if (astNode instanceof TmplAstForLoopBlock) {
		return transformTmplAstForLoopBlock(
			astNode,
			tmplAstTemplates,
			properties,
			transformTmplAstNodes,
		);
	}

	if (astNode instanceof TmplAstDeferredBlock) {
		return transformTmplAstDeferredBlock(
			astNode,
			tmplAstTemplates,
			properties,
			transformTmplAstNodes,
		);
	}

	if (astNode instanceof TmplAstTemplate) {
		return transformTmplAstTemplate(
			astNode,
			tmplAstTemplates,
			properties,
			transformTmplAstNodes,
		);
	}

	if (astNode instanceof TmplAstElement) {
		return transformTmplAstElement(
			astNode,
			tmplAstTemplates,
			properties,
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
