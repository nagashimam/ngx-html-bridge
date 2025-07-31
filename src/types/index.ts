import type { TmplAstNode, TmplAstTemplate } from "@angular/compiler";

export type TmplAstNodesTransformer = (
	nodes: TmplAstNode[],
	tmplAstTemplates: TmplAstTemplate[],
) => Node[][];

export type TmplAstLeafNodeTransformer<T extends TmplAstNode> = (
	node: T,
) => Node[][];

export type TmplAstBranchNodeTransformer<T extends TmplAstNode> = (
	node: T,
	tmplAstTemplates: TmplAstTemplate[],
	tmplAstNodesTransformer: TmplAstNodesTransformer,
) => Node[][];

export type TmplAstNodeDispatcher = (
	astNode: TmplAstNode,
	tmplAstTemplates: TmplAstTemplate[],
) => Node[][];

export type Attr = { name: string; value: string };
