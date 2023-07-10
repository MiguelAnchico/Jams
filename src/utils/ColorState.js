export const calcularAvance = (order) => {
	let porcentaje = 0;
	let color = '#1F1B16';
	order?.Procesos?.map((proceso) => {
		if (proceso.Tipo == 'Creación' && 0 > porcentaje) {
			porcentaje = 0;
			color = '#1F1B16';
		}
		if (proceso.Tipo == 'Facturado' && 10 > porcentaje) {
			porcentaje = 10;
			color = '#df7a0f';
		}
		if (proceso.Tipo == 'Separado' && 30 > porcentaje) {
			porcentaje = 30;
			color = '#dfab0f';
		}
		if (proceso.Tipo == 'Empacado' && 60 > porcentaje) {
			porcentaje = 60;
			color = '#c5df0f';
		}
		if (proceso.Tipo == 'Distribucion' && 80 > porcentaje) {
			porcentaje = 80;
			color = '#b2df0f';
		}
		if (proceso.Tipo == 'Entregado' && 80 > porcentaje) {
			porcentaje = 100;
			color = '#1f704e';
		}

		//red #df4a0f
	});

	if (order?.Revision) {
		color = 'rgb(0, 56, 164)';
	}
	if (order?.Corregir) {
		color = '#df4a0f';
	}

	if (order?.Estado == 'Cancelado') {
		porcentaje = 100;
		color = 'rgb(164, 0, 6)';
	}

	return [porcentaje, color];
};
