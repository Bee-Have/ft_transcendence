export function getQueryVariable(variable: string) {
	const search = window.location.search;
	const params = new URLSearchParams(search);
	return params.get(variable);
  }