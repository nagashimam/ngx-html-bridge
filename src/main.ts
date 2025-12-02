import * as fs from "node:fs";
import { generateHTMLs } from "./core/generator/index.js";
import { parse } from "./core/parser/index.js";
import { getPropertiesFromComponent } from "./core/properties/index.js";
import { transformParsedTemplate } from "./core/transformer/index.js";
import type { BridgeOption, HtmlVariation } from "./types/index.js";

export type { BridgeOption, HtmlVariation } from "./types/index.js";

/**
 * Parses an Angular template file and returns an array of possible static HTML string variations.
 *
 * @param templatePath The absolute path to the Angular template file.
 * @returns An array of static HTML strings, representing different rendering possibilities of the template.
 */
export const parseAngularTemplateFile = (
	templatePath: string,
	option: BridgeOption = {
		includedAttributes: [],
<<<<<<< HEAD
		nonEmptyItems: [],
=======
>>>>>>> 51f82da (feat: Add empty loop check)
	},
): Promise<HtmlVariation[]> => {
	const template = fs.readFileSync(templatePath, "utf-8");
	return parseAngularTemplate(template, templatePath, option);
};

export const parseAngularTemplate = async (
	template: string,
	templatePath: string,
	option: BridgeOption = {
		includedAttributes: [],
<<<<<<< HEAD
		nonEmptyItems: [],
=======
>>>>>>> 51f82da (feat: Add empty loop check)
	},
): Promise<HtmlVariation[]> => {
	const { parsedTemplate, tmplAstTemplates } = parse(template, templatePath);
	const properties = await getPropertiesFromComponent(templatePath);
	const nodes = await transformParsedTemplate(
		parsedTemplate,
		tmplAstTemplates,
		{ properties, nonEmptyItems: [] },
		option,
	);
	return generateHTMLs(nodes);
};
