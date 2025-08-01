import type { TmplAstNode, TmplAstTemplate } from "@angular/compiler";

export type TmplAstNodesTransformer = (
	nodes: TmplAstNode[],
	tmplAstTemplates: TmplAstTemplate[],
	properties: Properties,
) => Node[][];

export type TmplAstLeafNodeTransformer<T extends TmplAstNode> = (
	node: T,
) => Node[][];

export type TmplAstBranchNodeTransformer<T extends TmplAstNode> = (
	node: T,
	tmplAstTemplates: TmplAstTemplate[],
	properties: Properties,
	tmplAstNodesTransformer: TmplAstNodesTransformer,
) => Node[][];

export type TmplAstNodeDispatcher = (
	astNode: TmplAstNode,
	tmplAstTemplates: TmplAstTemplate[],
	properties: Properties,
) => Node[][];

export type Attr = { name: string; value: string };

type PropertyName = string;
type PropertyInitialValue = string;
export type Properties = Map<PropertyName, PropertyInitialValue>;
