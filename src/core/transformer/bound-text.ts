import { TmplAstBoundText } from "@angular/compiler";
import { TmplAstLeafNodeTransformer } from "../../types";
import { document } from "../dom";

/**
 * Transforms a TmplAstBoundText node into a text node with a placeholder value.
 *
 * @param boundText The TmplAstBoundText node to transform.
 * @returns A 2D array containing a single text node with "some random text" as its value.
 */
export const transformTmplAstBoundText: TmplAstLeafNodeTransformer<
	TmplAstBoundText
> = (boundText) => {
	return [[document.createTextNode("some random text")]];
};
