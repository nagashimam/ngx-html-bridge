import type {
	ASTWithSource,
	TmplAstBoundAttribute,
	TmplAstTemplate,
} from "@angular/compiler";
import type { TmplAstBranchNodeTransformer } from "../../types";

/**
 * Transforms a TmplAstTemplate node representing an *ngIf directive into a 2D array of DOM Nodes.
 * It handles both the 'then' and 'else' clauses of the *ngIf directive.
 *
 * @param ngIfTemplate The TmplAstTemplate node to transform.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @param transformTmplAstNodes The recursive function to transform child AST nodes.
 * @returns A 2D array of DOM Nodes representing the transformed *ngIf block.
 */
export const transformTmplAstTemplateNgIf: TmplAstBranchNodeTransformer<
	TmplAstTemplate
> = (ngIfTemplate, tmplAstTemplates, properties, transformTmplAstNodes) => {
	const results: Node[][] = [];

	const thenClause = findThenClause(ngIfTemplate, tmplAstTemplates);
	const elseClause = findElseClause(ngIfTemplate, tmplAstTemplates);

	if (thenClause) {
		results.push(
			...transformTmplAstNodes(
				thenClause.children,
				tmplAstTemplates,
				properties,
			),
		);
	} else {
		results.push(
			...transformTmplAstNodes(
				ngIfTemplate.children,
				tmplAstTemplates,
				properties,
			),
		);
	}

	if (elseClause) {
		results.push(
			...transformTmplAstNodes(
				elseClause.children,
				tmplAstTemplates,
				properties,
			),
		);
	} else {
		results.push([]);
	}

	return results;
};

/**
 * Finds the 'then' clause template for an *ngIf directive.
 *
 * @param ngIfTemplate The TmplAstTemplate node representing the *ngIf directive.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @returns The TmplAstTemplate node for the 'then' clause, or undefined if not found.
 */
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

/**
 * Extracts the source of the 'then' clause from a TmplAstTemplate node.
 *
 * @param template The TmplAstTemplate node.
 * @returns The source string of the 'then' clause, or undefined if not found.
 */
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

/**
 * Finds the 'else' clause template for an *ngIf directive.
 *
 * @param ngIfTemplate The TmplAstTemplate node representing the *ngIf directive.
 * @param tmplAstTemplates A list of all TmplAstTemplate nodes in the parsed template.
 * @returns The TmplAstTemplate node for the 'else' clause, or undefined if not found.
 */
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

/**
 * Extracts the source of the 'else' clause from a TmplAstTemplate node.
 *
 * @param template The TmplAstTemplate node.
 * @returns The source string of the 'else' clause, or undefined if not found.
 */
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
