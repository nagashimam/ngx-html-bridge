import { TmplAstTemplate } from "@angular/compiler";
import { TmplAstBranchNodeTransformer } from "../../types";
import { transformTmplAstTemplateNgIf } from "./ng-if";

/**
 * Transforms a TmplAstTemplate node into a 2D array of DOM Nodes.
 * It dispatches to `transformTmplAstTemplateNgIf` if the template represents an *ngIf directive.
 *
 * @param template The TmplAstTemplate node to transform.
 * @param templates A list of all TmplAstTemplate nodes in the parsed template.
 * @param transformTmplAstNodes The recursive function to transform child AST nodes.
 * @returns A 2D array of DOM Nodes representing the transformed template.
 */
export const transformTmplAstTemplate: TmplAstBranchNodeTransformer<
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

/**
 * Checks if a TmplAstTemplate node represents an *ngIf directive.
 *
 * @param template The TmplAstTemplate node to check.
 * @returns True if the template represents an *ngIf directive, false otherwise.
 */
const isNgIf = (template: TmplAstTemplate) => {
	return !!template.templateAttrs.find((attr) => attr.name === "ngIf");
};
