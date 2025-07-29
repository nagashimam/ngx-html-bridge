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

class TmplAstTemplateCollector extends TmplAstRecursiveVisitor {
	public templates: TmplAstTemplate[] = [];

	override visitTemplate(template: TmplAstTemplate) {
		super.visitTemplate(template);
		this.templates.push(template);
	}
}
