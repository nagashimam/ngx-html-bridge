import * as fs from "node:fs";
import { generateHTMLs } from "./core/generator/index";
import { parse } from "./core/parser/index";
import { getPropertiesFromComponent } from "./core/properties/index";
import { transformParsedTemplate } from "./core/transformer/index";
import type { BridgeOption, HtmlVariation } from "./types";

export type { BridgeOption, HtmlVariation } from "./types";

/**
 * Parses an Angular template file and returns an array of possible static HTML string variations.
 *
 * @param templatePath The absolute path to the Angular template file.
 * @returns An array of static HTML strings, representing different rendering possibilities of the template.
 */
export const parseAngularTemplateFile = (
	templatePath: string,
	option: BridgeOption = {},
): Promise<HtmlVariation[]> => {
	const template = fs.readFileSync(templatePath, "utf-8");
	return parseAngularTemplate(template, templatePath, option);
};

export const parseAngularTemplate = async (
	template: string,
	templatePath: string,
	option: BridgeOption = {},
): Promise<HtmlVariation[]> => {
	const { parsedTemplate, tmplAstTemplates } = await parse(
		template,
		templatePath,
	);
	const properties = await getPropertiesFromComponent(templatePath);
	const nodes = await transformParsedTemplate(
		parsedTemplate,
		tmplAstTemplates,
		properties,
		option,
	);
	return generateHTMLs(nodes);
};
