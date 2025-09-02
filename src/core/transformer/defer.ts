import type { TmplAstDeferredBlock } from "@angular/compiler";
import type { TmplAstBranchNodeTransformer } from "../../types/index.js";

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
> = async (
	deferBlock,
	tmplAstTemplates,
	properties,
	transformTmplAstNodes,
	option,
) => {
	const result: Node[][] = [];

	// Deferred content
	if (deferBlock.children) {
		result.push(
			...(await transformTmplAstNodes(
				deferBlock.children,
				tmplAstTemplates,
				properties,
				option,
			)),
		);
	}

	// Placeholder content
	if (deferBlock.placeholder) {
		result.push(
			...(await transformTmplAstNodes(
				deferBlock.placeholder.children,
				tmplAstTemplates,
				properties,
				option,
			)),
		);
	}

	// Loading content
	if (deferBlock.loading) {
		result.push(
			...(await transformTmplAstNodes(
				deferBlock.loading.children,
				tmplAstTemplates,
				properties,
				option,
			)),
		);
	}

	return result;
};
