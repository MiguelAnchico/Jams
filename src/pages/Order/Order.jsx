import { Header } from '../../components/Header/Header';
import { useOrder } from '../../app/hooks/Pedidos';

import { DateFormatter } from '../../utils/DateFormatter';
import { InfoCliente } from '../../components/InfoCliente/InfoCliente';
import { InfoEnvio } from '../../components/InfoEnvio/InfoEnvio';
import { InfoProductos } from '../../components/InfoProductos/InfoProductos';
import { InfoPedido } from '../../components/InfoPedido/InfoPedido';
import { PaymentView } from '../../components/PaymentView/PaymentView';
import { Procesos } from '../../components/Procesos/Procesos';
import { AddGuia } from '../../components/AddGuia/AddGuia';
import { AdminOptions } from '../../components/AdminOptions/AdminOptions';

import { calcularAvance } from '../../utils/ColorState';

import './Order.css';
import { Roles } from '../../app/hooks/Role';
import { Agendar } from '../../components/Agendar/Agendar';
import { CreateDoc } from '../../components/CreateDoc/CreateDoc';
import { Comentario } from '../../components/Comentario/Comentario';

const calcularPrecio = (order) => {
	let price = 0;
	order[0]?.Productos.map((producto) => {
		price += producto.Valor;
	});

	price += parseFloat(order[0]?.CostoEnvio);
	price += order[0]?.ComicionDroppi ? parseFloat(order[0]?.ComicionDroppi) : 0;

	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
	}).format(price);
};

export const Order = () => {
	const {
		data: order,
		error,
		isLoading,
		isFetching,
	} = useOrder({
		id: localStorage.getItem('orderId'),
		cedula: localStorage.getItem('orderCedula'),
		fecha: localStorage.getItem('orderFecha'),
	});

	const { administrador, logistica, cajero, contador, asesor } = Roles();

	return (
		<div className='Order'>
			<Header
				number={order ? order[0]?.Id : ''}
				state={order ? order[0]?.Estado : ''}
				price={order ? calcularPrecio(order) : ''}
				date={order ? DateFormatter(order[0]?.Fecha) : ''}
				type={order ? order[0]?.Tipo : ''}
				isRevision={order ? order[0]?.Revision : ''}
				isFixed={order ? order[0]?.Corregir : ''}
				isOrder={true}
				width={calcularAvance(order ? order[0] : [])[0] + '%'}
				color={calcularAvance(order ? order[0] : 'grey')[1]}
				isHome={false}
				url={'/home'}
			/>
			<div className='Content'>
				<InfoPedido order={order ? order[0] : ''} />
				<div className='OrderContent'>
					<InfoProductos
						productos={order ? order[0]?.Productos : ''}
						order={order ? order[0] : ''}
					/>
					{order ? (
						order[0]?.Tipo != 'Recogen' ? (
							<>
								<InfoCliente order={order ? order[0] : ''} />
								<InfoEnvio order={order ? order[0] : ''} />
								{order ? (
									!order[0].Facturado ? (
										<div className='OrderFacturadoDisplay labelLarge'>
											Aun no se ha facturado
										</div>
									) : (
										<></>
									)
								) : (
									<></>
								)}
							</>
						) : (
							''
						)
					) : (
						<></>
					)}
				</div>
			</div>
			<div style={{ zIndex: '100' }}>
				<div className='OrderSideBar'>
					<Comentario order={order ? order[0] : ''} />
					<PaymentView
						payment={order ? order[0]?.Pagos : ''}
						order={order ? order[0] : ''}
					/>

					<p className='headlineMedium'>Observaciones</p>
					<div className='OrderObservaciones bodySmall'>
						{order
							? order[0]?.Observaciones
								? order[0]?.Observaciones
								: 'Ninguna'
							: 'Sin cargar'}
					</div>

					{order ? (
						order[0]?.NumeroFactura ? (
							<div className='bodySmall NumeroFactura'>
								La factura esta registrada como:
								<span className='headlineSmall'>
									{' '}
									{order[0]?.NumeroFactura}
								</span>
							</div>
						) : (
							<></>
						)
					) : (
						<></>
					)}

					{order ? (
						order[0]?.Domicilio?.Agendado ? (
							<p className='bodySmall'>
								Agendado en la franja{' '}
								<span className='headlineSmall'>
									{new Date(
										order[0]?.Domicilio?.FechaAgendadoInicio
									).toLocaleString('es-CO')}{' '}
								</span>
								<span className='headlineSmall'>
									{new Date(
										order[0]?.Domicilio?.FechaAgendadoFinal
									).toLocaleString('es-CO')}
								</span>
							</p>
						) : (
							<></>
						)
					) : (
						<></>
					)}
					<Procesos procesos={order ? order[0]?.Procesos : ''} />
					{logistica ? (
						order ? (
							order[0]?.Tipo == 'Domicilio' ? (
								<Agendar order={order ? order[0] : ''} />
							) : (
								<AddGuia order={order ? order[0] : ''} />
							)
						) : (
							<></>
						)
					) : (
						<></>
					)}
					{order ? (
						order[0]?.Tipo == 'Despacho' ? (
							<CreateDoc order={order ? order[0] : ''} />
						) : (
							<></>
						)
					) : (
						<></>
					)}
				</div>
			</div>
			{administrador ? <AdminOptions order={order ? order[0] : ''} /> : <></>}
		</div>
	);
};
