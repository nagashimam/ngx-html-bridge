import { TmplAstSwitchBlock } from "@angular/compiler";
import { TransformTmplAstNodeRecursivly } from "../../types";

export const transformTmplAstSwitchBlock: TransformTmplAstNodeRecursivly<
	TmplAstSwitchBlock
> = (switchBlock, tmplAstTemplates, transformTmplAstNodes) => {
	const result: Node[][] = [];

	for (const switchCase of switchBlock.cases) {
		result.push(
			...transformTmplAstNodes(switchCase.children, tmplAstTemplates),
		);
	}

	if (switchBlock.cases.length === 1) {
		result.push([]);
	}

	return result;
};
