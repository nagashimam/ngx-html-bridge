import type { AST } from "@angular/compiler";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/typescript-estree";

export const castNode = <T extends TSESTree.Node>(node: TSESTree.Node): T =>
	node as unknown as T;

export const castAST = <T extends AST>(ast: AST): T => ast as T;

export const isTSESTreeIdentifier = (node: TSESTree.Node) =>
	(node.type as string) === TSESTree.AST_NODE_TYPES.Identifier;

export const isTSESTreeLiteral = (node: TSESTree.Node) =>
	(node.type as string) === TSESTree.AST_NODE_TYPES.Literal;

export const isTSESTreeConditionalExpression = (node: TSESTree.Node) =>
	(node.type as string) === TSESTree.AST_NODE_TYPES.ConditionalExpression;

export const isTSESExportNamedDeclaration = (
	statement: TSESTree.ProgramStatement,
) => statement.type === AST_NODE_TYPES.ExportNamedDeclaration;

export const isTSESClassDeclaration = (
	declaration: TSESTree.ExportNamedDeclaration,
) => declaration?.declaration?.type === AST_NODE_TYPES.ClassDeclaration;

export const isTSEStreePropertyDefinition = (
	classElement: TSESTree.ClassElement,
) => classElement.type === AST_NODE_TYPES.PropertyDefinition;

// TODO: Check if the class has @Component decorator or not
// TODO: Add options to specify component suffix
export const isComponentClass = (
	declaration: TSESTree.ExportNamedDeclaration,
) =>
	declaration.declaration &&
	castNode<TSESTree.ClassDeclaration>(
		declaration.declaration,
	)?.id?.name.includes("Component");
