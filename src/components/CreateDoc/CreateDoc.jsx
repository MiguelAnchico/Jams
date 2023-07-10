import { generateWordDocument } from '../../app/hooks/Doc';

export const CreateDoc = ({ order }) => {
	const downloadDoc = () => {
		generateWordDocument(
			order?.NombreCliente,
			order?.CedulaCliente,
			order?.Despacho?.Direccion,
			order?.Despacho?.Departamento,
			order?.Despacho?.Ciudad,
			order?.Whatsapp
		);
	};

	return (
		<button
			className='button labelSmall'
			style={{ marginTop: '16px' }}
			disabled={!order}
			onClick={downloadDoc}
		>
			Descargar Hablador
		</button>
	);
};
