import { TmplAstDeferredBlock } from "@angular/compiler";
import { TmplAstBranchNodeTransformer } from "../../types";

/**
 * Transforms a TmplAstDeferredBlock node into a 2D array of DOM Nodes.
 * It processes the deferred content, placeholder content, and loading content.
 *
 * @param deferBlock The TmplAstDeferredBlock node to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @param transformTmplAstNodes The recursive function to transform child AST nodes.
 * @returns A 2D array of DOM Nodes representing the transformed deferred block.
 */
export const transformTmplAstDeferredBlock: TmplAstBranchNodeTransformer<
	TmplAstDeferredBlock
> = (deferBlock, tmplAstTemplates, properties, transformTmplAstNodes) => {
	const result: Node[][] = [];

	// Deferred content
	if (deferBlock.children) {
		result.push(
			...transformTmplAstNodes(
				deferBlock.children,
				tmplAstTemplates,
				properties,
			),
		);
	}

	// Placeholder content
	if (deferBlock.placeholder) {
		result.push(
			...transformTmplAstNodes(
				deferBlock.placeholder.children,
				tmplAstTemplates,
				properties,
			),
		);
	}

	// Loading content
	if (deferBlock.loading) {
		result.push(
			...transformTmplAstNodes(
				deferBlock.loading.children,
				tmplAstTemplates,
				properties,
			),
		);
	}

	return result;
};
