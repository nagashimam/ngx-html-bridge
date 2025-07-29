import {
	ASTWithSource,
	TmplAstBoundAttribute,
	TmplAstTemplate,
} from "@angular/compiler";
import { TransformTmplAstNodeRecursivly } from "../../types";

export const transformTmplAstTemplateNgIf: TransformTmplAstNodeRecursivly<
	TmplAstTemplate
> = (ngIfTemplate, tmplAstTemplates, transformTmplAstNodes) => {
	const results = [];

	const thenClause = findThenClause(ngIfTemplate, tmplAstTemplates);
	const elseClause = findElseClause(ngIfTemplate, tmplAstTemplates);

	if (thenClause) {
		results.push(
			...transformTmplAstNodes(thenClause.children, tmplAstTemplates),
		);
	} else {
		results.push(
			...transformTmplAstNodes(ngIfTemplate.children, tmplAstTemplates),
		);
	}

	if (elseClause) {
		results.push(
			...transformTmplAstNodes(elseClause.children, tmplAstTemplates),
		);
	} else {
		results.push([]);
	}

	return results;
};

const findThenClause = (
	ngIfTemplate: TmplAstTemplate,
	tmplAstTemplates: TmplAstTemplate[],
) => {
	const source = findThenClauseSource(ngIfTemplate);
	if (!source) {
		return undefined;
	}

	return tmplAstTemplates.find(
		(template) =>
			!!template.references.find((reference) => reference.name === source),
	);
};

const findThenClauseSource = (template: TmplAstTemplate) => {
	const thenClause = template.templateAttrs.find(
		(attr) => attr.name === "ngIfThen",
	);
	if (!thenClause) {
		return undefined;
	}
	return ((thenClause as TmplAstBoundAttribute)?.value as ASTWithSource)
		?.source;
};

const findElseClause = (
	ngIfTemplate: TmplAstTemplate,
	tmplAstTemplates: TmplAstTemplate[],
) => {
	const source = findElseClauseSource(ngIfTemplate);
	if (!source) {
		return undefined;
	}

	return tmplAstTemplates.find(
		(template) =>
			!!template.references.find((reference) => reference.name === source),
	);
};

const findElseClauseSource = (template: TmplAstTemplate) => {
	const elseClause = template.templateAttrs.find(
		(attr) => attr.name === "ngIfElse",
	);
	if (!elseClause) {
		return undefined;
	}
	return ((elseClause as TmplAstBoundAttribute)?.value as ASTWithSource)
		?.source;
};
