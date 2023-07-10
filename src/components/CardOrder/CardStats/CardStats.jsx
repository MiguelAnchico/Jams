import './CardStats.css';

export const CardStats = ({
	state,
	date,
	color,
	mobile,
	id,
	corregir,
	isRevision,
	productos,
}) => {
	const comprobarProductos = () => {
		let enBerlin = false;
		productos?.map((producto) => {
			if (producto.Estado == 'Cambiando Talla') return (enBerlin = true);
		});

		return enBerlin;
	};

	const comprobarBodega = () => {
		let enBodega = false;
		productos?.map((producto) => {
			if (producto.Estado == 'En 2da Bodega') return (enBodega = true);
		});

		return enBodega;
	};
	return (
		<div className='CardStats'>
			{mobile ? (
				<>
					<div className='StateMobile'>
						<p className='labelLarge'>{id}</p>
						<p className='bodySmall'>Estado</p>
						<div
							className='labelSmall'
							style={
								comprobarBodega()
									? { backgroundColor: 'rgb(164, 0, 82)' }
									: comprobarProductos()
									? { backgroundColor: 'rgb(118, 0, 164)' }
									: { backgroundColor: color }
							}
						>
							{comprobarBodega()
								? 'En 2da Bodega'
								: comprobarProductos()
								? 'En Berlin'
								: isRevision
								? 'En Revision'
								: corregir
								? 'Corregir'
								: state}
						</div>
					</div>
				</>
			) : (
				<>
					<div className='State'>
						<p className='headlineSmall'>Estado</p>
						<div
							className='labelSmall'
							style={
								comprobarBodega()
									? { backgroundColor: 'rgb(164, 0, 82)' }
									: comprobarProductos()
									? { backgroundColor: 'rgb(118, 0, 164)' }
									: { backgroundColor: color }
							}
						>
							{comprobarBodega()
								? 'En 2da Bodega'
								: comprobarProductos()
								? 'En Berlin'
								: isRevision
								? 'En Revision'
								: corregir
								? 'Corregir'
								: state}
						</div>
					</div>
					<div className='Date'>
						<div className='Icon'>
							<img />
							<p className='headlineSmall'>Fecha</p>
						</div>
						<p className='bodySmall'> {date}</p>
					</div>
				</>
			)}
		</div>
	);
};
