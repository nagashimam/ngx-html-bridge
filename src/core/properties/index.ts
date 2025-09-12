/**
 * @fileoverview
 * This file contains the logic for extracting property information from an Angular
 * component's TypeScript file. This is used to resolve attribute and property
 * bindings in the corresponding template.
 */
import { existsSync, readFileSync } from "node:fs";
import { parse, type TSESTree } from "@typescript-eslint/typescript-estree";
import type { Properties } from "../../types/index.js";
import {
	castNode,
	isComponentClass,
	isTSESClassDeclaration,
	isTSESExportNamedDeclaration,
	isTSESTreeArrayExpression,
	isTSESTreeCallExpression,
	isTSESTreeIdentifier,
	isTSESTreeSpreadElement,
	isTSEStreePropertyDefinition,
} from "./utils.js";

/**
 * Extracts public and protected properties from an Angular component's TypeScript
 * file that are accessible from its template.
 *
 * @param templateUrl The path to the component's HTML template file.
 * @returns A map of property names to their initial values.
 */
export const getPropertiesFromComponent = async (
	templateUrl: string,
): Promise<Properties> => {
	const properties = new Map<string, string>();

	const classDeclaration = await getClassDeclaration(templateUrl);
	if (!classDeclaration) {
		return properties;
	}

	const propertiesAccessibleFromTemplate =
		getPropertiesAccessibleFromTemplate(classDeclaration);
	if (!propertiesAccessibleFromTemplate) {
		return properties;
	}

	// TODO: Consider case like `[attr.data-foo]="flag ? '': undefined"`.
	// Simply rewriting value to "some random text" is not ideal for cases like above
	for (const property of propertiesAccessibleFromTemplate) {
		try {
			const name = castNode<TSESTree.Identifier>(property.key).name;
			const initialValue = (() => {
				if (property.value === null) {
					return "some random text";
				}

				return getLiteralValue(property.value);
			})();

			properties.set(name, initialValue);
		} catch {}
	}

	return properties;
};

const getClassDeclaration = async (templateUrl: string) => {
	try {
		const componentFile = templateUrl.replace(".html", ".ts");
		if (!existsSync(componentFile)) {
			return undefined;
		}

		const code = readFileSync(componentFile, { encoding: "utf8" });

		const ast = parse(code, {
			loc: true,
			range: true,
		});

		return getComponentDeclaration(ast);
	} catch {
		return undefined;
	}
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
	try {
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
	} catch {
		return undefined;
	}
};

/**
 * Extracts the literal value from a property's value expression.
 *
 * @param value The expression node for the property's value.
 * @returns The `Literal` node containing the value.
 */
const getLiteralValue = (value: TSESTree.Expression): string => {
	if (isTSESTreeArrayExpression(value)) {
		const arrayExpression = castNode<TSESTree.ArrayExpression>(value);
		return convertArrayExpressionToString(arrayExpression);
	}

	const convertNodeToString = (node: TSESTree.Node) => {
		return (
			castNode<TSESTree.Literal>(node).value?.toString() || "some random text"
		);
	};

	if (isTSESTreeCallExpression(value)) {
		const argument = castNode<TSESTree.CallExpression>(value).arguments[0];
		return convertNodeToString(argument);
	}

	return convertNodeToString(value);
};

const convertArrayExpressionToString = (
	arrayExpression: TSESTree.ArrayExpression,
) => {
	const elements: string[] = [];
	arrayExpression.elements
		.filter((element) => !!element)
		.forEach((element) => {
			// spreadElement is things like `[...1,2,3]`. This thing could be nested inside array expression like [...["one", "two"], "three"]
			if (isTSESTreeSpreadElement(element)) {
				const spreadElement = JSON.parse(
					getLiteralValue(castNode<TSESTree.SpreadElement>(element).argument),
				);
				if (Array.isArray(spreadElement)) {
					spreadElement.forEach((element) => {
						elements.push(element);
					});
				}
			} else {
				elements.push(getLiteralValue(castNode<TSESTree.Expression>(element)));
			}
		});
	return JSON.stringify(elements);
};
