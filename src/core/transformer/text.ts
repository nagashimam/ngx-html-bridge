import { TmplAstText } from "@angular/compiler";
import { document } from "../dom";
import { TmplAstNodeTransformer } from "../../types";

/**
 * Transforms a TmplAstText node into a text node.
 *
 * @param text The TmplAstText node to transform.
 * @returns A 2D array containing a single text node.
 */
export const transformTmplAstText: TmplAstNodeTransformer<TmplAstText> = (
	text,
) => {
	return [[document.createTextNode(text.value)]];
};
