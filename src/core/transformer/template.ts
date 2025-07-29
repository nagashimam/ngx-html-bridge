import { TmplAstTemplate } from "@angular/compiler";
import { TransformTmplAstNodeRecursivly } from "../../types";
import { transformTmplAstTemplateNgIf } from "./ngif";

export const transformTmplAstTemplate: TransformTmplAstNodeRecursivly<
	TmplAstTemplate
> = (template, templates, transformTmplAstNodes) => {
	if (isNgIf(template)) {
		return transformTmplAstTemplateNgIf(
			template,
			templates,
			transformTmplAstNodes,
		);
	}
	return [[]];
};

const isNgIf = (template: TmplAstTemplate) => {
	return !!template.templateAttrs.find((attr) => attr.name === "ngIf");
};
