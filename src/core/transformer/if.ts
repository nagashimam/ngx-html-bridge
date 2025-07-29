import { TmplAstIfBlock } from "@angular/compiler";
import { TransformTmplAstNodeRecursivly } from "../../types";

export const transformTmplAstIfBlock: TransformTmplAstNodeRecursivly<
	TmplAstIfBlock
> = (ifBlock, transformTmplAstNodes) => {
	const result: Node[][] = [];

	if (ifBlock.branches.length === 1) {
		// This block doesn't have else clause, so we need to add empty string manually
		result.push([]);
	}
	for (const branch of ifBlock.branches) {
		result.push(...transformTmplAstNodes(branch.children));
	}

	return result;
};
