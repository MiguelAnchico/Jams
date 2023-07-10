import { BarProgress } from '../BarProgress/BarProgress';
import { Product } from '../Product/Product';
import { CardHeader } from './CardHeader/CardHeader';
import { CardStats } from './CardStats/CardStats';
import { CardInfo } from './CardInfo/CardInfo';

import testProfile from '../../test/user.png';
import expand from '../../assets/images/expandir.png';

import { DateFormatter } from '../../utils/DateFormatter';
import './CardOrder.css';
import { Navigate, useNavigate } from 'react-router-dom';

import { urlimage } from '../../app/api/Config';
import { Roles } from '../../app/hooks/Role';

export const CardOrder = ({
	nombre,
	nombreCreador,
	tipoEnvio,
	imagen,
	imagen1,
	imagen2,
	mobile,
	estado,
	fecha,
	cedula,
	whatsapp,
	productos,
	facturado,
	id,
	style,
	corregir,
	isContador,
	pagos,
	revision,
	agendado,
}) => {
	const navigate = useNavigate();

	const expandOrder = () => {
		localStorage.setItem('orderId', id);
		localStorage.setItem('orderCedula', cedula);
		localStorage.setItem('orderFecha', fecha);
		navigate('/order');
	};

	const { administrador, logistica, cajero, contador, asesor } = Roles();

	const confirmarPendiente = () => {
		let pendiente = 'No';
		if (cajero) {
			pagos.map((pago) => {
				if (pago.Confirmado == false) return (pendiente = 'Si');
			});
		}

		if (contador) {
			pendiente = 'No';

			pagos.map((pago) => {
				if (pago.Nombre != 'Cartera') return (pendiente = 'Si');
			});

			pagos.map((pago) => {
				if (pago.Confirmado == false) return (pendiente = 'Si');
			});
		}

		return pendiente;
	};

	return (
		<div
			className='CardOrder'
			style={
				mobile
					? { width: '100%', boxShadow: 'none', margin: '4px' }
					: { width: '350px', margin: '16px', overflow: 'hidden' }
			}
		>
			{!mobile ? (
				<>
					<CardHeader
						name={nombreCreador}
						type={tipoEnvio}
						profile={testProfile}
					/>
					<div className='CardImage'>
						<img src={urlimage + imagen} />
					</div>
					<div className='CardBar'>
						<p className='headlineSmall'>Progreso</p>
						<BarProgress borderRadius={40} width={'80%'} color='green' />
					</div>
					<CardStats
						state={agendado ? 'Agendado' : estado}
						color={agendado ? '#03d8d8' : style[1]}
						corregir={corregir}
						isRevision={revision}
						productos={productos}
						date={DateFormatter(fecha)}
					/>
					<CardInfo name={nombre} id={cedula} whatsapp={whatsapp} />
					<p className='headlineSmall CardProductTitle'>Productos</p>
					<div className='CardProduct'>
						{productos?.map((producto, index) => {
							if (index < 3)
								return (
									<Product
										name={producto.NombreProducto}
										code={producto.CodigoProducto}
									/>
								);
						})}
					</div>
					<button onClick={expandOrder} className='labelSmall'>
						Expandir
					</button>
					<div
						className='CardBill labelSmall'
						style={
							facturado
								? { backgroundColor: 'rgb(0, 56, 164)', color: 'white' }
								: { backgroundColor: '#000', color: 'white' }
						}
					>
						{facturado ? 'Facturado' : 'Sin Facturar'}
					</div>
				</>
			) : (
				<div
					className='CardOrderTable'
					style={
						isContador
							? {
									gridTemplateColumns:
										'minmax(200px,1fr) minmax(200px,1fr) minmax(300px,1fr) minmax(100px,1fr) minmax(100px,1fr) minmax(100px,1fr) minmax(100px,1fr) minmax(100px,1fr)',
							  }
							: {}
					}
				>
					<div className='CardImage'>
						<img src={urlimage + imagen} className='ImagePrincipal' />
						<div className='ImageSecondary'>
							{imagen1 ? <img src={urlimage + imagen1} /> : <></>}
							{imagen2 ? <img src={urlimage + imagen2} /> : <></>}
						</div>
						
					</div>
					<div>
						<CardStats
							id={id}
							state={agendado ? 'Agendado' : estado}
							corregir={corregir}
							isRevision={revision}
							color={style[1]}
							date={DateFormatter(fecha)}
							mobile={mobile}
							key={id + 'info'}
							productos={productos}
						/>
					</div>
					<CardInfo name={nombre} id={cedula} whatsapp={whatsapp} />
					<p className='headlineSmall'>{tipoEnvio}</p>
					{isContador ? (
						<p className='headlineSmall'>{confirmarPendiente()}</p>
					) : (
						<></>
					)}
					<p className='headlineSmall'>{facturado ? 'Si' : 'No'}</p>
					<p className='headlineSmall'>{DateFormatter(fecha)}</p>
					<a onAuxClick={expandOrder} onClick={expandOrder}>
						<img
							src={expand}
							onClick={expandOrder}
							className='labelSmall expandIcon'
						/>
					</a>
				</div>
			)}
		</div>
	);
};
