import type { TmplAstNode, TmplAstTemplate } from "@angular/compiler";

export type TmplAstNodesTransformer = (
	nodes: TmplAstNode[],
	tmplAstTemplates: TmplAstTemplate[],
) => Node[][];

export type TmplAstNodeTransformer<T extends TmplAstNode> = (
	node: T,
	tmplAstTemplate: TmplAstTemplate[],
) => Node[][];

export type RecursiveTmplAstNodeTransformer<T extends TmplAstNode> = (
	node: T,
	tmplAstTemplate: TmplAstTemplate[],
	transformTmplAstNode: TmplAstNodesTransformer,
) => Node[][];
