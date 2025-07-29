import { parseTemplateFile } from "./core/parser";
import { transformParsedTemplate } from "./core/transformer";
import { generateHTMLs } from "./core/generator";

export const parseAngularTemplate = (templatePath: string): string[] => {
	const { parsedTemplate, tmplAstTemplates } = parseTemplateFile(templatePath);
	const nodes = transformParsedTemplate(parsedTemplate, tmplAstTemplates);
	return generateHTMLs(nodes);
};
