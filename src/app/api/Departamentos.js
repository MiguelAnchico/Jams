const API =
	'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json';

export const getDepartments = async () => {
	const response = await fetch(API);
	const data = await response.json();

	return data;
};
