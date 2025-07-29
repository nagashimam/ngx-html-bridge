import { parseTemplateFile } from "./core/parser";
import { transformParsedTemplate } from "./core/transformer";
import { generateHTMLs } from "./core/generator";

export const parseAngularTemplate = (templatePath: string): string[] => {
	const astNodes = parseTemplateFile(templatePath);
	const nodes = transformParsedTemplate(astNodes);
	return generateHTMLs(nodes);
};
