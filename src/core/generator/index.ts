import { document } from "../dom";

export const generateHTMLs = (node2DArray: Node[][]): string[] => {
	return node2DArray.map((nodeArray) => generateHTML(nodeArray));
};

const generateHTML = (nodes: Node[]): string => {
	const container = document.createElement("div");
	for (const node of nodes) {
		container.appendChild(node);
	}
	return container.innerHTML;
};
