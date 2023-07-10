import './InfoProductos.css';
import { CardProductOrder } from './CardProductOrder/CardProductOrder';
import { useMutateUpdateOrder } from '../../app/hooks/Pedidos';
import { useMutateProcess } from '../../app/hooks/Procesos';
import { Bloqueador } from '../../components/Bloqueador/Bloqueado';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { Roles } from '../../app/hooks/Role';

const dateNow = (currentdate) => {
	return (
		currentdate.getFullYear() +
		'-' +
		(currentdate.getMonth() + 1) +
		'-' +
		currentdate.getDate() +
		' ' +
		currentdate.getHours() +
		':' +
		currentdate.getMinutes() +
		':' +
		currentdate.getSeconds()
	);
};

export const InfoProductos = ({ productos, order }) => {
	const { ActualizarEstado, errorDatos } = useNotificationsFeedback();
	const {
		mutate: mutateOrder,
		isLoading: isLoagindOrder,
		error: errorOrder,
	} = useMutateUpdateOrder();
	const {
		mutate: mutateProcess,
		isLoading,
		errorUpdateProcess,
	} = useMutateProcess();

	const { administrador, logistica, cajero, contador, asesor } = Roles();

	const cambiarEstado = (estado) => {
		if (order?.Estado == estado)
			return errorDatos('El pedido se encuentra actualmente en ese estado');
		if (estado == 'Empacado')
			if (order?.Estado != 'Separado' && order?.Estado != 'Retenido')
				return errorDatos('El pedido ya ha sido empacado');
		mutateOrder(
			{
				id: localStorage.getItem('orderId'),
				cedula: localStorage.getItem('orderCedula'),
				fecha: localStorage.getItem('orderFecha'),
				put: {
					Estado: estado,
				},
			},
			{
				onSuccess: () => {
					let text = 'El pedido ha sido empacado por ';
					if (estado == 'Devolucion')
						text = 'El pedido se encuentra en devolucion, reportado por ';
					if (estado == 'Entregado')
						text = 'El pedido se ha entregado, reportado por ';
					mutateProcess({
						Tipo: estado,
						CedulaCliente: order?.CedulaCliente,
						Fecha: order?.Fecha,
						Id: order?.Id,
						FechaProceso: dateNow(new Date()),
						Contexto:
							text +
							localStorage.getItem('nombre') +
							' #' +
							localStorage.getItem('id'),
					});
				},
			}
		);
	};

	const comprobarDisponibilidad = () => {
		let disponible = true;
		productos?.map((producto) => {
			disponible = producto.Estado == 'Disponible' ? disponible : false;
		});

		return disponible;
	};

	const comprobarEntregado = () => {
		let comprobado = false;
		order?.Procesos?.map((proceso) => {
			if (proceso?.Tipo == 'Entregado') return (comprobado = true);
		});

		return comprobado;
	};

	return (
		<div className='InfoProductos'>
			<p className='bodySmall'>2. Disponibilidad del producto</p>
			<h3>
				Asegúrese de que la talla, color y demás especificaciones del producto
				coincidan
			</h3>
			<div class='InfoProductosContainer'>
				{productos &&
					productos?.map((producto) => (
						<CardProductOrder producto={producto} order={order} />
					))}
			</div>
			{order ? (
				order?.Tipo != 'Recogen' ? (
					<button
						disabled={
							(order && logistica && !order?.Revision) ||
							(order && administrador)
								? !comprobarDisponibilidad()
								: true
						}
						className='button labelSmall'
						onClick={(e) => ActualizarEstado(cambiarEstado, 'Empacado')}
					>
						Empacado
					</button>
				) : (
					<>
						<button
							disabled={
								(order && logistica && !order?.Revision) ||
								(order && administrador)
									? !comprobarDisponibilidad()
									: true
							}
							className='button buttonEntregado labelSmall'
							onClick={(e) => ActualizarEstado(cambiarEstado, 'Entregado')}
						>
							Entregado
						</button>

						<button
							disabled={
								(logistica && !order?.Revision) || administrador ? false : true
							}
							style={comprobarEntregado() ? {} : { display: 'none' }}
							className='button buttonDevolucion labelSmall'
							onClick={(e) => ActualizarEstado(cambiarEstado, 'Devolucion')}
						>
							Devolucion
						</button>
					</>
				)
			) : (
				<></>
			)}

			<Bloqueador
				array={order?.Procesos}
				valueElement='Separado'
				llave='Tipo'
			/>
		</div>
	);
};
