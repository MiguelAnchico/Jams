export const DateFormatter = (fecha) => {
	const newDate = new Date(fecha);
	const currentDate = new Date();

	const tiempoTotalEnMinutos =
		-newDate.getMinutes() -
		newDate.getHours() * 60 -
		newDate.getDate() * 24 * 60 -
		newDate.getMonth() * 30 * 24 * 60 +
		currentDate.getMinutes() +
		currentDate.getHours() * 60 +
		currentDate.getDate() * 24 * 60 +
		currentDate.getMonth() * 30 * 24 * 60;

	let textMes =
		Math.trunc(tiempoTotalEnMinutos / 60 / 24 / 30) > 1 ? ' meses' : ' mes';
	let textDia =
		Math.trunc(tiempoTotalEnMinutos / 60 / 24) > 1 ? ' dias' : ' dia';
	let textHora = Math.trunc(tiempoTotalEnMinutos / 60) > 1 ? ' horas' : ' hora';

	if (Math.trunc(tiempoTotalEnMinutos / 60 / 24 / 30) > 0)
		return 'Hace ' + Math.trunc(tiempoTotalEnMinutos / 60 / 24 / 30) + textMes;
	if (Math.trunc(tiempoTotalEnMinutos / 60 / 24) > 0)
		return 'Hace ' + Math.trunc(tiempoTotalEnMinutos / 60 / 24) + textDia;
	if (Math.trunc(tiempoTotalEnMinutos / 60) > 0)
		return 'Hace ' + Math.trunc(tiempoTotalEnMinutos / 60) + textHora;

	return 'Hace ' + tiempoTotalEnMinutos + ' minutos';
};
