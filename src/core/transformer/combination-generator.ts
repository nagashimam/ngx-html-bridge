import type { Attr } from "../../types";
/**
 * Combine all combinations from a 3D array of nodes.
 * Example: Takes [[[div#1]],[[div#2]],[[div#3],[div#4,div#5]]] and outputs [[div#1,div#2,div#3, div#4],[div#1,div#2,div#3,div#5]]
 *
 * @param arrays A 3D array of nodes.
 * @returns A 2D array representing all possible combinations of nodes.
 */
export const generateCombinations = (arrays: Node[][][]): Node[][] => {
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

/**
 * Generates all possible combinations of attribute values from a 2D array of Attr objects.
 * This is particularly useful for handling ternary operators in attribute bindings,
 * where each ternary branch can lead to a different attribute value.
 *
 * For example, given:
 * `[
 *   [ { name: 'hidden', value: undefined }, { name: 'hidden', value: 'until-found' }, { name: 'hidden', value: '' } ],
 *   [ { name: 'aria-hidden', value: 'false' }, { name: 'aria-hidden', value: 'true' } ]
 * ]`
 *
 * This function will output all combinations like:
 * `[
 *   [ { name: 'hidden', value: undefined }, { name: 'aria-hidden', value: 'false' } ],
 *   [ { name: 'hidden', value: undefined }, { name: 'aria-hidden', value: 'true' } ],
 *   ...
 * ]`
 *
 * @param ternaryAttrs A 2D array where each inner array represents possible values for a single attribute (e.g., from a ternary expression).
 * @returns A 2D array where each inner array is a unique combination of attributes.
 */
export const generateAttrCombinations = (ternaryAttrs: Attr[][]): Attr[][] => {
	const result: Attr[][] = [];

	function backtrack(index: number, currentCombination: Attr[]) {
		if (index === ternaryAttrs.length) {
			result.push([...currentCombination]);
			return;
		}

		const currentAttributeValues = ternaryAttrs[index];
		for (const attr of currentAttributeValues) {
			currentCombination.push(attr);
			backtrack(index + 1, currentCombination);
			currentCombination.pop();
		}
	}

	backtrack(0, []);
	return result;
};
