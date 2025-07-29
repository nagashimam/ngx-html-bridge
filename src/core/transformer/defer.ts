import { TmplAstDeferredBlock } from "@angular/compiler";
import { TransformTmplAstNodeRecursivly } from "../../types";

export const transformTmplAstDeferredBlock: TransformTmplAstNodeRecursivly<
	TmplAstDeferredBlock
> = (deferBlock, tmplAstTemplates, transformTmplAstNodes) => {
	const result: Node[][] = [];

	// Deferred content
	if (deferBlock.children) {
		result.push(
			...transformTmplAstNodes(deferBlock.children, tmplAstTemplates),
		);
	}

	// Placeholder content
	if (deferBlock.placeholder) {
		result.push(
			...transformTmplAstNodes(
				deferBlock.placeholder.children,
				tmplAstTemplates,
			),
		);
	}

	// Loading content
	if (deferBlock.loading) {
		result.push(
			...transformTmplAstNodes(deferBlock.loading.children, tmplAstTemplates),
		);
	}

	return result;
};
