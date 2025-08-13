/**
 * @fileoverview
 * This file defines the core types used throughout the template transformation process.
 */
import type { TmplAstNode, TmplAstTemplate } from "@angular/compiler";

/**
 * A function that transforms an array of `TmplAstNode` objects into a 2D array of DOM Nodes.
 */
export type TmplAstNodesTransformer = (
	nodes: TmplAstNode[],
	tmplAstTemplates: TmplAstTemplate[],
	properties: Properties,
) => Node[][];

/**
 * A function that transforms a single leaf `TmplAstNode` (one with no children) into a 2D array of DOM Nodes.
 */
export type TmplAstLeafNodeTransformer<T extends TmplAstNode> = (
	node: T,
) => Node[][];

/**
 * A function that transforms a single branch `TmplAstNode` (one with children) into a 2D array of DOM Nodes.
 */
export type TmplAstBranchNodeTransformer<T extends TmplAstNode> = (
	node: T,
	tmplAstTemplates: TmplAstTemplate[],
	properties: Properties,
	tmplAstNodesTransformer: TmplAstNodesTransformer,
) => Node[][];

/**
 * A function that dispatches a `TmplAstNode` to the appropriate transformer.
 */
export type TmplAstNodeDispatcher = (
	astNode: TmplAstNode,
	tmplAstTemplates: TmplAstTemplate[],
	properties: Properties,
) => Node[][];

/**
 * Represents an HTML attribute with a name and a value.
 */
export type Attr = { name: string; value: string | undefined | null };

/**
 * The name of a component property.
 */
type PropertyName = string;
/**
 * The initial value of a component property.
 */
type PropertyInitialValue = string;
/**
 * A map of component property names to their initial values.
 */
export type Properties = Map<PropertyName, PropertyInitialValue>;

/**
 * Represents a single variation of the parsed HTML output.
 */
export type HtmlVariation = {
	/**
	 * The plain, static HTML string.
	 */
	plain: string;
	/**
	 * The HTML string with additional metadata attributes for mapping back to the original template.
	 */
	anotated: string;
};
