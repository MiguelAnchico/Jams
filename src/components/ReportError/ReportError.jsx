import './ReportError.css';

export const ReportError = ({ procesos }) => {
	const crearProcesos = () => {
		let errores = filtrarProcesos();
		let mostrarErrores = [];

		errores?.map((mensaje, index) => {
			let contexto = mensaje?.Contexto;

			contexto = contexto?.split('Debe de corregir los campos: \n')[1];
			contexto = contexto?.split('\n reportado por ')[0];
			contexto = contexto?.split('\n');
			console.log(contexto);

			mostrarErrores.push(contexto);
		});

		return mostrarErrores;
	};

	const filtrarProcesos = () => {
		let pendientesCorregir = [];
		procesos?.map((proceso) => {
			if (proceso.Tipo == 'Correción') pendientesCorregir.push(proceso);
			if (proceso.Tipo == 'Corregido') pendientesCorregir = [];
		});

		return pendientesCorregir;
	};
	return (
		<div className='ReportError'>
			{crearProcesos().length > 0 ? (
				<ol style={{ padding: '32px' }}>
					{crearProcesos().map((proceso) => {
						return proceso?.map((elemento) => (
							<li className='bodyMedium'>{elemento}</li>
						));
					})}
				</ol>
			) : (
				<></>
			)}
		</div>
	);
};
