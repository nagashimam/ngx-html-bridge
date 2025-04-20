import { existsSync, readFileSync } from "node:fs";
import type { TSESTree } from "@typescript-eslint/typescript-estree";
import { parse, AST_NODE_TYPES } from "@typescript-eslint/typescript-estree";
import type { Properties } from "./types.ts";

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

	for (const property of propertiesAccessibleFromTemplate) {
		const name = (property.key as TSESTree.Identifier).name;
		const initialValue =
			(property.value as TSESTree.Literal).value?.toString() ||
			"some random text";
		properties.set(name, initialValue);
	}

	return properties;
};

const getComponentDeclaration = (
	ast: TSESTree.Program,
): TSESTree.ClassDeclaration | undefined => {
	const namedExport: TSESTree.ExportNamedDeclaration | undefined =
		ast.body.find(
			(body) =>
				body.type === AST_NODE_TYPES.ExportNamedDeclaration &&
				body.declaration?.type === AST_NODE_TYPES.ClassDeclaration &&
				// TODO: Add options to specify component suffix
				body.declaration?.id?.name.includes("Component"),
		) as TSESTree.ExportNamedDeclaration | undefined;
	return namedExport?.declaration as TSESTree.ClassDeclaration | undefined;
};

const getPropertiesAccessibleFromTemplate = (
	classDeclaration: TSESTree.ClassDeclaration,
) => {
	return classDeclaration.body.body.filter((definition) => {
		if (definition.type !== AST_NODE_TYPES.PropertyDefinition) {
			return false;
		}

		if (definition.key.type !== AST_NODE_TYPES.Identifier) {
			return false;
		}

		if (definition.accessibility === "private") {
			return false;
		}

		return !!(definition as unknown as TSESTree.Literal);
	}) as TSESTree.PropertyDefinition[];
};
