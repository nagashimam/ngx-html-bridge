import type { ASTWithSource, TmplAstIfBlock } from "@angular/compiler";
import type { TmplAstBranchNodeTransformer } from "../../types/index.js";

/**
 * Transforms a TmplAstIfBlock node into a 2D array of DOM Nodes.
 * It processes each branch of the if block and adds an empty array if no else branch is present.
 *
 * @param ifBlock The TmplAstIfBlock node to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @param transformTmplAstNodes The recursive function to transform child AST nodes.
 * @returns A 2D array of DOM Nodes representing the transformed if block.
 */
export const transformTmplAstIfBlock: TmplAstBranchNodeTransformer<
	TmplAstIfBlock
> = async (
	ifBlock,
	tmplAstTemplates,
	properties,
	transformTmplAstNodes,
	option,
) => {
	const result: Node[][] = [];

	if (ifBlock.branches.length === 1) {
		// This block doesn't have else clause, so we need to add empty string manually
		result.push([]);
	}
	for (const branch of ifBlock.branches) {
		const source = ((branch.expression as ASTWithSource)?.source || "").trim();
		const lengthCheckMatches = source.match(/(.*).length/);
		const nonEmptyItems = lengthCheckMatches
			? [...option.nonEmptyItems, lengthCheckMatches[1]]
			: option.nonEmptyItems;

		result.push(
			...(await transformTmplAstNodes(
				branch.children,
				tmplAstTemplates,
				properties,
				{
					...option,
					nonEmptyItems,
				},
			)),
		);
	}

	return result;
};
