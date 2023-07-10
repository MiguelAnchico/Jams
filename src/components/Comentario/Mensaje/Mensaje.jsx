import './Mensaje.css';

export const Mensaje = ({ mensaje, creador, fecha, usuario }) => {
	return (
		<div className={usuario == creador ? 'MensajeProp' : 'Mensaje'}>
			<div className='Mensaje-Image labelSmall'>{creador[0]}</div>
			<div className='Mensaje-Container'>
				<div className='Mensaje-Container_Info'>
					<span className='headlineSmall'>{creador}</span>
					<span className='bodySmall date'>
						{new Date(fecha).toLocaleString('es-CO')}
					</span>
				</div>
				<br />
				<p className='Mensaje-container_contenido bodySmall'>{mensaje}</p>
			</div>
		</div>
	);
};
