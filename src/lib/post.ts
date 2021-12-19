export function truncateString(str: string, length: number) {
	if (str.length > length) {
		return str.slice(0, length) + '...';
	} else {
		return str;
	}
}

export function readingTime(content: string) {
	const wpm = 225;
	const words = content.trim().split(/\s+/).length;
	const time = Math.ceil(words / wpm);
	return time;
}

export const slugify = (text: string) => {
	// Use hash map for special characters
	let specialChars = {
		à: 'a',
		ä: 'a',
		á: 'a',
		â: 'a',
		æ: 'a',
		å: 'a',
		ë: 'e',
		è: 'e',
		é: 'e',
		ê: 'e',
		î: 'i',
		ï: 'i',
		ì: 'i',
		í: 'i',
		ò: 'o',
		ó: 'o',
		ö: 'o',
		ô: 'o',
		ø: 'o',
		ù: 'o',
		ú: 'u',
		ü: 'u',
		û: 'u',
		ñ: 'n',
		ç: 'c',
		ß: 's',
		ÿ: 'y',
		œ: 'o',
		ŕ: 'r',
		ś: 's',
		ń: 'n',
		ṕ: 'p',
		ẃ: 'w',
		ǵ: 'g',
		ǹ: 'n',
		ḿ: 'm',
		ǘ: 'u',
		ẍ: 'x',
		ź: 'z',
		ḧ: 'h',
		'·': '-',
		'/': '-',
		_: '-',
		',': '-',
		':': '-',
		';': '-'
	};

	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/./g, (target, index, str) => specialChars[target] || target) // Replace special characters using the hash map
		.replace(/&/g, '-and-') // Replace & with 'and'
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
};
