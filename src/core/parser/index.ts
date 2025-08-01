import {
	parseTemplate,
	TmplAstRecursiveVisitor,
	TmplAstTemplate,
	tmplAstVisitAll,
} from "@angular/compiler";
import * as fs from "node:fs";

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
