import { TmplAstForLoopBlock } from "@angular/compiler";
import { TransformTmplAstNodeRecursivly } from "../../types";

export const transformTmplAstForLoopBlock: TransformTmplAstNodeRecursivly<
	TmplAstForLoopBlock
> = (forBlock, transformTmplAstNodes) => {
	const result: Node[][] = [];

	// Handle case for no loop
	if (forBlock.empty && forBlock.empty.children.length > 0) {
		for (const parsedEmptyBlock of transformTmplAstNodes(
			forBlock.empty.children,
		)) {
			result.push(parsedEmptyBlock);
		}
	} else {
		result.push([]);
	}

	// Handle case for loop once
	for (const parsedForBlock of transformTmplAstNodes(forBlock.children)) {
		result.push(parsedForBlock);
	}

	// Handle case for loop twice
	for (const parsedForBlock of transformTmplAstNodes([
		...forBlock.children,
		...forBlock.children,
	])) {
		result.push(parsedForBlock);
	}

	return result;
};