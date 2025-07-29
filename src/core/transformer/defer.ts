import { TmplAstDeferredBlock } from "@angular/compiler";
import { TransformTmplAstNodeRecursivly } from "../../types";

export const transformTmplAstDeferredBlock: TransformTmplAstNodeRecursivly<
	TmplAstDeferredBlock
> = (deferBlock, transformTmplAstNodes) => {
	const result: Node[][] = [];

	// Deferred content
	if (deferBlock.children) {
		result.push(...transformTmplAstNodes(deferBlock.children));
	}

	// Placeholder content
	if (deferBlock.placeholder) {
		result.push(...transformTmplAstNodes(deferBlock.placeholder.children));
	}

	// Loading content
	if (deferBlock.loading) {
		result.push(...transformTmplAstNodes(deferBlock.loading.children));
	}

	return result;
};

