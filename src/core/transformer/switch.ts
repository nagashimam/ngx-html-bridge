import type { TmplAstSwitchBlock } from "@angular/compiler";
import type { TmplAstBranchNodeTransformer } from "../../types/index.js";

/**
 * Transforms a TmplAstSwitchBlock node into a 2D array of DOM Nodes.
 * It processes each case of the switch block and adds an empty array if no default case is present and only one case is defined.
 *
 * @param switchBlock The TmplAstSwitchBlock node to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @param transformTmplAstNodes The recursive function to transform child AST nodes.
 * @returns A 2D array of DOM Nodes representing the transformed switch block.
 */
export const transformTmplAstSwitchBlock: TmplAstBranchNodeTransformer<
	TmplAstSwitchBlock
> = async (
	switchBlock,
	tmplAstTemplates,
	metadata,
	transformTmplAstNodes,
	option,
) => {
	const result: Node[][] = [];

	for (const switchCase of switchBlock.cases) {
		result.push(
			...(await transformTmplAstNodes(
				switchCase.children,
				tmplAstTemplates,
				metadata,
				option,
			)),
		);
	}

	if (switchBlock.cases.length === 1) {
		result.push([]);
	}

	return result;
};
