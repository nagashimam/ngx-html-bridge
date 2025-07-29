import type { TmplAstNode, TmplAstTemplate } from "@angular/compiler";

export type TransformTmplAstNodes = (
	nodes: TmplAstNode[],
	tmplAstTemplates: TmplAstTemplate[],
) => Node[][];

export type TransformTmplAstNode<T extends TmplAstNode> = (
	node: T,
	tmplAstTemplate: TmplAstTemplate[],
) => Node[][];

export type TransformTmplAstNodeRecursivly<T extends TmplAstNode> = (
	node: T,
	tmplAstTemplate: TmplAstTemplate[],
	transformTmplAstNode: TransformTmplAstNodes,
) => Node[][];
