/**
 * @fileoverview
 * This file contains the core logic for parsing Angular templates.
 * It uses the Angular compiler to create an AST and then collects
 * all `TmplAstTemplate` nodes for further processing.
 */

import * as fs from "node:fs";
import {
	parseTemplate,
	TmplAstRecursiveVisitor,
	type TmplAstTemplate,
	tmplAstVisitAll,
} from "@angular/compiler";

/**
 * Parses an Angular template file and extracts the parsed template and all `TmplAstTemplate` nodes.
 *
 * @param templatePath The absolute path to the Angular template file.
 * @returns An object containing the parsed template and an array of `TmplAstTemplate` nodes.
 */
export const parseTemplateFile = (templatePath: string) => {
	const template = fs.readFileSync(templatePath, "utf-8");
	const parsedTemplate = parseTemplate(template, templatePath);
	const collector = new TmplAstTemplateCollector();
	tmplAstVisitAll(collector, parsedTemplate.nodes);
	return {
		parsedTemplate,
		tmplAstTemplates: collector.templates,
	};
};

/**
 * A visitor that collects all `TmplAstTemplate` nodes from an Angular AST.
 * This is used to gather all `<ng-template>` elements, which are crucial
 * for resolving structural directives like `*ngIf`.
 */
class TmplAstTemplateCollector extends TmplAstRecursiveVisitor {
	public templates: TmplAstTemplate[] = [];

	/**
	 * Visits a `TmplAstTemplate` node and adds it to the collection.
	 * @param template The `TmplAstTemplate` node to visit.
	 */
	override visitTemplate(template: TmplAstTemplate) {
		super.visitTemplate(template);
		this.templates.push(template);
	}
}
