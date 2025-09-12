import type { TmplAstForLoopBlock } from "@angular/compiler";
import type { TmplAstBranchNodeTransformer } from "../../types/index.js";

/**
 * Transforms a TmplAstForLoopBlock node into a 2D array of DOM Nodes.
 * It handles zero, one, and two iterations of the loop, including the @empty block.
 *
 * @param forBlock The TmplAstForLoopBlock node to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @param transformTmplAstNodes The recursive function to transform child AST nodes.
 * @returns A 2D array of DOM Nodes representing the transformed for loop.
 */
export const transformTmplAstForLoopBlock: TmplAstBranchNodeTransformer<
	TmplAstForLoopBlock
> = async (
	forBlock,
	tmplAstTemplates,
	properties,
	transformTmplAstNodes,
	option,
) => {
	const result: Node[][] = [];
	// Handle case for no loop
	if (forBlock.empty && forBlock.empty.children.length > 0) {
		for (const parsedEmptyBlock of await transformTmplAstNodes(
			forBlock.empty.children,
			tmplAstTemplates,
			properties,
			option,
		)) {
			result.push(parsedEmptyBlock);
		}
	} else {
		result.push([]);
	}

	// Handle case for loop once
	// Set $index variable in for loop
	properties.set("$index", "0");
	for (const parsedForBlock of await transformTmplAstNodes(
		forBlock.children,
		tmplAstTemplates,
		properties,
		option,
	)) {
		result.push(parsedForBlock);
	}

	// Handle case for loop twice
	const firstLoop = await transformTmplAstNodes(
		forBlock.children,
		tmplAstTemplates,
		properties,
		option,
	);
	properties.delete("$index");
	properties.set("$index", "1");
	const secondLoop = await transformTmplAstNodes(
		forBlock.children,
		tmplAstTemplates,
		properties,
		option,
	);

	for (let i = 0; i < firstLoop.length; i++) {
		firstLoop[i].push(...secondLoop[i]);
		result.push(firstLoop[i]);
	}

	return result;
};
