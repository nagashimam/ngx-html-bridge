import { parseTemplate } from "@angular/compiler";
import * as fs from "node:fs";

export const parseTemplateFile = (templatePath: string) => {
	const template = fs.readFileSync(templatePath, "utf-8");
	return parseTemplate(template, templatePath);
};
