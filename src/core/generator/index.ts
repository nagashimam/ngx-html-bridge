import type { HtmlVariation } from "../../types/index.js";
import { document } from "../dom/index.js";
import { attributeNames } from "../transformer/element.js";

/**
 * Generates an array of HTML strings from a 2D array of DOM Nodes.
 *
 * @param node2DArray A 2D array where each inner array represents a sequence of DOM Nodes for a single HTML output.
 * @returns An array of HTML strings.
 */
export const generateHTMLs = (node2DArray: Node[][]): HtmlVariation[] => {
	return node2DArray.map((nodeArray) => generateHTML(nodeArray));
};

/**
 * Generates an HTML string from an array of DOM Nodes.
 *
 * @param nodes An array of DOM Nodes.
 * @returns The HTML string representation of the nodes.
 */
const generateHTML = (nodes: Node[]): HtmlVariation => {
	const annotatedContainer = document.createElement("div");
	for (const node of nodes) {
		annotatedContainer.appendChild(node);
	}
	const annotated = annotatedContainer.innerHTML;

	const plainContainer = document.createElement("div");
	for (const node of nodes) {
		plainContainer.appendChild(node.cloneNode(true));
	}
	for (const el of plainContainer.querySelectorAll(
		"[data-ngx-html-bridge-line]",
	)) {
		el.removeAttribute("data-ngx-html-bridge-line");
		el.removeAttribute("data-ngx-html-bridge-col");
		el.removeAttribute("data-ngx-html-bridge-start-offset");
		el.removeAttribute("data-ngx-html-bridge-end-offset");
	}
	for (const attribute of new Set(attributeNames)) {
		for (const el of plainContainer.querySelectorAll(
			`[data-ngx-html-bridge-${attribute}-start-offset]`,
		)) {
			el.removeAttribute(`data-ngx-html-bridge-${attribute}-start-offset`);
			el.removeAttribute(`data-ngx-html-bridge-${attribute}-end-offset`);
		}
	}
	const plain = plainContainer.innerHTML;

	return {
		annotated,
		plain,
	};
};
