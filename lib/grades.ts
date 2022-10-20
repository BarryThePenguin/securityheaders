const grades = new Map([
	[0, 'F'],
	[1, 'E'],
	[2, 'D'],
	[3, 'C'],
	[4, 'B'],
	[5, 'A'],
	[6, 'A'],
	[7, 'A+'],
]);

function getScore(grade: string) {
	const [key] = [...grades].find(([, value]) => value === grade);
	return key;
}

export default new Proxy(grades, {
	get(target, prop) {
		if (prop === 'getScore') {
			return getScore;
		}

		const score = typeof prop === 'string' ? Number.parseInt(prop, 10) : 0;

		if (score >= 7) {
			return target.get(7);
		}

		return target.has(score) ? target.get(score) : target.get(0);
	},
}) as typeof grades & {'getScore': typeof getScore};
