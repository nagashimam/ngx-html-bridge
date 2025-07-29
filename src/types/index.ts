import type { TmplAstNode } from "@angular/compiler";

export type TransformTmplAstNodes = (nodes: TmplAstNode[]) => Node[][];
export type TransformTmplAstNode<T extends TmplAstNode> = (node: T) => Node[][];
export type TransformTmplAstNodeRecursivly<T extends TmplAstNode> = (
	node: T,
	transformTmplAstNode: TransformTmplAstNodes,
) => Node[][];
