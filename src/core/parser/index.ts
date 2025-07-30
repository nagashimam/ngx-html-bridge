import {
	parseTemplate,
	TmplAstRecursiveVisitor,
	TmplAstTemplate,
	tmplAstVisitAll,
} from "@angular/compiler";
import * as fs from "node:fs";

/**
 * Parses an Angular template file and extracts its AST and all TmplAstTemplate nodes.
 *
 * @param templatePath The path to the Angular template file.
 * @returns An object containing the parsed template (AST) and a list of all TmplAstTemplate nodes.
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
 * Collects all TmplAstTemplate nodes from an Angular AST.
 */
class TmplAstTemplateCollector extends TmplAstRecursiveVisitor {
	public templates: TmplAstTemplate[] = [];

	/**
	 * Overrides the default visitTemplate method to collect TmplAstTemplate nodes.
	 * @param template The TmplAstTemplate node to visit.
	 * @returns The visited TmplAstTemplate node.
	 */
	override visitTemplate(template: TmplAstTemplate) {
		super.visitTemplate(template);
		this.templates.push(template);
	}
}
