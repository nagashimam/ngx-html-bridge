import type { Attr, ParsedAttr } from "./types.ts";

// Generate all combinations of 3-D array of nodes
// Example: Takes [[[div#1]],[[div#2]],[[div#3],[div#4,div#5]]] and outputs [[div#1,div#2,div#3],[div#1,div#2,div#4,div#5]]
export const generate3DCombinations = (arrays: Node[][][]): Node[][] => {
	const result: Node[][] = [];

	function backtrack(index: number, current: Node[]) {
		if (index === arrays.length) {
			result.push([...current]);
			return;
		}

		for (const subArray of arrays[index]) {
			for (const value of subArray) {
				current.push(value);
			}
			backtrack(index + 1, current);
			for (let i = 0; i < subArray.length; i++) {
				current.pop();
			}
		}
	}

	backtrack(0, []);
	return result;
};

export const generateCombinations = (ternaryAttrs: Attr[]): ParsedAttr[][] => {
	const result: ParsedAttr[][] = [];

	function backtrack(index: number, current: ParsedAttr[]) {
		if (index === ternaryAttrs.length) {
			result.push([...current]);
			return;
		}

		const { name, values } = ternaryAttrs[index];

		for (const value of values) {
			current.push({ name, value });
			backtrack(index + 1, current);
			current.pop();
		}
	}

	backtrack(0, []);
	return result;
};
