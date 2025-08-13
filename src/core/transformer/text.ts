import type { TmplAstText } from "@angular/compiler";
import type { TmplAstLeafNodeTransformer } from "../../types";
import { document } from "../dom";

/**
 * Transforms a TmplAstText node into a text node.
 *
 * @param text The TmplAstText node to transform.
 * @returns A 2D array containing a single text node.
 */
export const transformTmplAstText: TmplAstLeafNodeTransformer<TmplAstText> = (
	text,
) => {
	return [[document.createTextNode(text.value)]];
};
