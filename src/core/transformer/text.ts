import { TmplAstText } from "@angular/compiler";
import { document } from "../dom";
import { TransformTmplAstNode } from "../../types";

export const transformTmplAstText: TransformTmplAstNode<TmplAstText> = (
	text,
) => {
	return [[document.createTextNode(text.value)]];
};
