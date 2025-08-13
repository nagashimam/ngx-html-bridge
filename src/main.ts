import { generateHTMLs } from "./core/generator/index";
import { parseTemplateFile } from "./core/parser/index";
import { getPropertiesFromComponent } from "./core/properties/index";
import { transformParsedTemplate } from "./core/transformer/index";
import type { HtmlVariation } from "./types";

/**
 * Parses an Angular template file and returns an array of possible static HTML string variations.
 *
 * @param templatePath The absolute path to the Angular template file.
 * @returns An array of static HTML strings, representing different rendering possibilities of the template.
 */
export const parseAngularTemplate = (templatePath: string): HtmlVariation[] => {
	const { parsedTemplate, tmplAstTemplates } = parseTemplateFile(templatePath);
	const properties = getPropertiesFromComponent(templatePath);
	const nodes = transformParsedTemplate(
		parsedTemplate,
		tmplAstTemplates,
		properties,
	);
	return generateHTMLs(nodes);
};
