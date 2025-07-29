import { TmplAstBoundText } from "@angular/compiler";
import { TransformTmplAstNode } from "../../types";
import { document } from "../dom";

export const transformTmplAstBoundText: TransformTmplAstNode<
	TmplAstBoundText
> = () => {
	return [[document.createTextNode("some random text")]];
};
