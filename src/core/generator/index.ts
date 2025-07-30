import { document } from "../dom";

/**
 * Generates an array of HTML strings from a 2D array of DOM Nodes.
 *
 * @param node2DArray A 2D array where each inner array represents a sequence of DOM Nodes for a single HTML output.
 * @returns An array of HTML strings.
 */
export const generateHTMLs = (node2DArray: Node[][]): string[] => {
	return node2DArray.map((nodeArray) => generateHTML(nodeArray));
};

/**
 * Generates an HTML string from an array of DOM Nodes.
 *
 * @param nodes An array of DOM Nodes.
 * @returns The HTML string representation of the nodes.
 */
const generateHTML = (nodes: Node[]): string => {
	const container = document.createElement("div");
	for (const node of nodes) {
		container.appendChild(node);
	}
	return container.innerHTML;
};
