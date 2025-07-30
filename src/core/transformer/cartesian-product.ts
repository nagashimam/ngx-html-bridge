/**
 * Generates all combinations from a 3D array of nodes.
 * Example: Takes [[[div#1]],[[div#2]],[[div#3],[div#4,div#5]]] and outputs [[div#1,div#2,div#3],[div#1,div#2,div#4,div#5]]
 *
 * @param arrays A 3D array of nodes.
 * @returns A 2D array representing all possible combinations of nodes.
 */
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
