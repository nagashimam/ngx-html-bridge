import type { HtmlVariation } from "../../types";
import { document } from "../dom";

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
	const anotatedContainer = document.createElement("div");
	for (const node of nodes) {
		anotatedContainer.appendChild(node);
	}
	const anotated = anotatedContainer.innerHTML;

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
	const plain = plainContainer.innerHTML;

	return {
		anotated,
		plain,
	};
};
