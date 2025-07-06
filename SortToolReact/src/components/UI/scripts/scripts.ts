export const calculateClass = (arrClass: string[]): string => {
	let className = '';
	arrClass.forEach((item) => {
		if (item) {
			className += item + ' ';
		}
	});
	return className.trim();
};
