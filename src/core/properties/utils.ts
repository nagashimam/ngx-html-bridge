/**
 * @fileoverview
 * This file provides utility functions for working with TypeScript AST nodes,
 * specifically for identifying and casting nodes related to Angular components.
 */
import type { AST } from "@angular/compiler";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/typescript-estree";

/**
 * Casts a TSESTree node to a specific type.
 * @param node The node to cast.
 * @returns The node cast to the specified type.
 */
export const castNode = <T extends TSESTree.Node>(node: TSESTree.Node): T =>
	node as unknown as T;

/**
 * Casts an Angular AST node to a specific type.
 * @param ast The Angular AST node to cast.
 * @returns The node cast to the specified type.
 */
export const castAST = <T extends AST>(ast: AST): T => ast as T;

/**
 * Checks if a node is a `CallExpression`.
 * @param node The node to check.
 * @returns True if the node is a `CallExpression`.
 */
export const isTSESTreeCallExpression = (node: TSESTree.Node) =>
	(node.type as string) === TSESTree.AST_NODE_TYPES.CallExpression;

/**
 * Checks if a node is an `Identifier`.
 * @param node The node to check.
 * @returns True if the node is an `Identifier`.
 */
export const isTSESTreeIdentifier = (node: TSESTree.Node) =>
	(node.type as string) === TSESTree.AST_NODE_TYPES.Identifier;

/**
 * Checks if a node is a `Literal`.
 * @param node The node to check.
 * @returns True if the node is a `Literal`.
 */
export const isTSESTreeLiteral = (node: TSESTree.Node) =>
	(node.type as string) === TSESTree.AST_NODE_TYPES.Literal;

/**
 * Checks if a node is a `ConditionalExpression`.
 * @param node The node to check.
 * @returns True if the node is a `ConditionalExpression`.
 */
export const isTSESTreeConditionalExpression = (node: TSESTree.Node) =>
	(node.type as string) === TSESTree.AST_NODE_TYPES.ConditionalExpression;

/**
 * Checks if a statement is an `ExportNamedDeclaration`.
 * @param statement The statement to check.
 * @returns True if the statement is an `ExportNamedDeclaration`.
 */
export const isTSESExportNamedDeclaration = (
	statement: TSESTree.ProgramStatement,
) => statement.type === AST_NODE_TYPES.ExportNamedDeclaration;

/**
 * Checks if a declaration is a `ClassDeclaration`.
 * @param declaration The declaration to check.
 * @returns True if the declaration is a `ClassDeclaration`.
 */
export const isTSESClassDeclaration = (
	declaration: TSESTree.ExportNamedDeclaration,
) => declaration?.declaration?.type === AST_NODE_TYPES.ClassDeclaration;

/**
 * Checks if a class element is a `PropertyDefinition`.
 * @param classElement The class element to check.
 * @returns True if the class element is a `PropertyDefinition`.
 */
export const isTSEStreePropertyDefinition = (
	classElement: TSESTree.ClassElement,
) => classElement.type === AST_NODE_TYPES.PropertyDefinition;

/**
 * Checks if a class is an Angular component by looking for the `@Component` decorator.
 * @param declaration The `ExportNamedDeclaration` of the class.
 * @returns True if the class is a component.
 */
export const isComponentClass = (
	declaration: TSESTree.ExportNamedDeclaration,
) => {
	if (!declaration.declaration) {
		return false;
	}
	const decoratorNames = castNode<TSESTree.ClassDeclaration>(
		declaration.declaration,
	).decorators.map((decorator) => {
		const expression = decorator.expression;
		const callee = castNode<TSESTree.CallExpression>(expression).callee;
		const identifier = castNode<TSESTree.Identifier>(callee);
		return identifier.name;
	});
	return decoratorNames.includes("Component");
};
