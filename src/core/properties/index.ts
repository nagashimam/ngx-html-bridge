/**
 * @fileoverview
 * This file contains the logic for extracting property information from an Angular
 * component's TypeScript file. This is used to resolve attribute and property
 * bindings in the corresponding template.
 */
import { existsSync, readFileSync } from "node:fs";
import type { TSESTree } from "@typescript-eslint/typescript-estree";
import { parse } from "@typescript-eslint/typescript-estree";
import type { Properties } from "../../types";
import {
	castNode,
	isComponentClass,
	isTSESClassDeclaration,
	isTSESExportNamedDeclaration,
	isTSESTreeCallExpression,
	isTSESTreeIdentifier,
	isTSEStreePropertyDefinition,
} from "./utils";

/**
 * Extracts public and protected properties from an Angular component's TypeScript
 * file that are accessible from its template.
 *
 * @param templateUrl The path to the component's HTML template file.
 * @returns A map of property names to their initial values.
 */
export const getPropertiesFromComponent = (templateUrl: string): Properties => {
	const properties = new Map<string, string>();
	const componentFile = templateUrl.replace(".html", ".ts");
	if (!existsSync(componentFile)) {
		return properties;
	}

	const code = readFileSync(componentFile, { encoding: "utf8" });
	const ast = parse(code, {
		loc: true,
		range: true,
	});

	const classDeclaration = getComponentDeclaration(ast);
	if (!classDeclaration) {
		return properties;
	}

	const propertiesAccessibleFromTemplate =
		getPropertiesAccessibleFromTemplate(classDeclaration);

	// TODO: Consider case like `[attr.data-foo]="flag ? '': undefined"`.
	// Simply rewriting value to "some random text" is not ideal for cases like above
	for (const property of propertiesAccessibleFromTemplate) {
		const name = castNode<TSESTree.Identifier>(property.key).name;
		const initialValue = (() => {
			if (property.value === null) {
				return "some random text";
			}

			const literal = getLiteralFromValue(property.value);
			return literal.value?.toString() || "some random text";
		})();

		properties.set(name, initialValue);
	}

	return properties;
};

/**
 * Finds the TypeScript `ClassDeclaration` for the component.
 *
 * @param ast The program's abstract syntax tree.
 * @returns The `ClassDeclaration` node for the component, or `undefined` if not found.
 */
const getComponentDeclaration = (
	ast: TSESTree.Program,
): TSESTree.ClassDeclaration | undefined => {
	const namedExport: TSESTree.Node | undefined = ast.body.find(
		(body) =>
			isTSESExportNamedDeclaration(body) &&
			isTSESClassDeclaration(body) &&
			isComponentClass(body),
	);

	if (!namedExport) {
		return undefined;
	}

	const declaration = castNode<TSESTree.ExportNamedDeclaration>(namedExport);
	if (!declaration.declaration) {
		return undefined;
	}

	return (
		castNode<TSESTree.ClassDeclaration>(declaration.declaration) || undefined
	);
};

/**
 * Filters and returns the properties that are accessible from the template.
 *
 * @param classDeclaration The component's `ClassDeclaration` node.
 * @returns An array of `PropertyDefinition` nodes.
 */
const getPropertiesAccessibleFromTemplate = (
	classDeclaration: TSESTree.ClassDeclaration,
) => {
	return classDeclaration.body.body
		.filter((classElement) => {
			if (!isTSEStreePropertyDefinition(classElement)) {
				return false;
			}

			if (!isTSESTreeIdentifier(classElement.key)) {
				return false;
			}

			const propertyDefinition =
				castNode<TSESTree.PropertyDefinition>(classElement);
			if (propertyDefinition.accessibility === "private") {
				return false;
			}

			return !!castNode<TSESTree.Literal>(classElement);
		})
		.map((definition) => castNode<TSESTree.PropertyDefinition>(definition));
};

/**
 * Extracts the literal value from a property's value expression.
 *
 * @param value The expression node for the property's value.
 * @returns The `Literal` node containing the value.
 */
const getLiteralFromValue = (value: TSESTree.Expression) => {
	if (isTSESTreeCallExpression(value)) {
		const argument = castNode<TSESTree.CallExpression>(value).arguments[0];
		return castNode<TSESTree.Literal>(argument);
	}
	return castNode<TSESTree.Literal>(value);
};
