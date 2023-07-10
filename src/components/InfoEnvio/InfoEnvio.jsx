import { useMutateUpdateShipping } from '../../app/hooks/Despachos';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { useMutateUpdateOrder } from '../../app/hooks/Pedidos';
import { useMutateProcess } from '../../app/hooks/Procesos';
import { Roles } from '../../app/hooks/Role';
import { Bloqueador } from '../Bloqueador/Bloqueado';
import './InfoEnvio.css';

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

export const InfoEnvio = ({ order }) => {
	const { ActualizarEstado, errorDatos } = useNotificationsFeedback();
	const { administrador, logistica, cajero, contador, asesor } = Roles();
	const {
		mutate: mutateOrder,
		isLoading: isLoagindOrder,
		error: errorOrder,
	} = useMutateUpdateOrder();
	const {
		mutate: mutateProcess,
		isLoading,
		error: errorUpdateProcess,
	} = useMutateProcess();

	const {
		mutate: mutateShipping,
		isLoading: isLoadingShipping,
		error: errorUpdateShipping,
	} = useMutateUpdateShipping();

	const cambiarEstado = (estado) => {
		if (order.Estado == estado)
			return errorDatos('El pedido se encuentra actualmente en ese estado');

		if (order.Estado == 'Regresando') {
			if (estado != 'Devolucion')
				return errorDatos(
					'El pedido no se encuentra en la tienda para realizar el respectivo cambio de estado'
				);
		} else {
			if (
				order.Estado != 'Distribucion' &&
				order.Estado != 'Reenvio' &&
				estado != 'En Retorno' &&
				estado != 'Retornado' &&
				order?.Tipo != 'Domicilio'
			)
				return errorDatos(
					'El pedido no se encuentra en camino al cliente como para pasar a ' +
						estado
				);
		}

		if (
			estado == 'Entregado' &&
			order?.Estado != 'Distribucion' &&
			order?.Tipo == 'Domicilio'
		)
			return errorDatos(
				'El pedido no se ha enviado, por lo que no es posible pasarlo a ' +
					estado
			);

		if (
			estado == 'En Retorno' &&
			(order?.Despacho?.TransportadoraRetorno == null ||
				order?.Despacho?.GuiaRetorno == null)
		)
			return errorDatos(
				'El pedido no cuenta con guia y transportadora de retorno'
			);

		mutateOrder(
			{
				id: order.Id,
				cedula: order.CedulaCliente,
				fecha: order.Fecha,
				put: {
					Estado: estado,
				},
			},
			{
				onSuccess: () => {
					let text = '';
					if (estado == 'Regresando')
						text = 'El pedido se encuentra en regreso, reportado por ';
					if (estado == 'Entregado')
						text = 'El pedido sea entregado, reportado por ';
					if (estado == 'En Retorno') {
						text = `El pedido se le ha asignado la transportadora ${order?.Despacho?.TransportadoraRetorno} con el numero de guia ${order?.Despacho?.GuiaRetorno} para su retorno por `;
					}

					mutateProcess(
						{
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
						},
						{
							onSuccess: () => {
								if (order?.Tipo == 'Despacho' && estado == 'Devolucion')
									mutateShipping({
										id: order?.Id,
										cedula: order?.CedulaCliente,
										fecha: order?.Fecha,
										put: {
											Transportadora: null,
											Guia: null,
										},
									});
								if (estado == 'En Retorno')
									mutateOrder({
										id: order.Id,
										cedula: order.CedulaCliente,
										fecha: order.Fecha,
										put: {
											Estado: 'En Retorno',
										},
									});
							},
						}
					);
				},
			}
		);
	};

	const comprobarEntregado = () => {
		let comprobado = false;
		order?.Procesos?.map((proceso) => {
			if (proceso?.Tipo == 'Entregado') return (comprobado = true);
		});

		return comprobado;
	};

	return (
		<div className='InfoEnvio'>
			<p className='bodySmall'>4. Finalizado</p>
			<h3>¿Se ha entregado exitosamente el pedido?</h3>
			{order?.Estado != 'En Retorno' ? (
				order?.Estado != 'Regresando' ? (
					<button
						className='button buttonRegresando labelSmall'
						onClick={(e) => ActualizarEstado(cambiarEstado, 'Regresando')}
						disabled={
							(logistica && !order?.Revision) || administrador ? false : true
						}
					>
						Regresando
					</button>
				) : (
					<button
						className='button buttonDevolucion labelSmall'
						onClick={(e) => ActualizarEstado(cambiarEstado, 'Devolucion')}
						disabled={
							(logistica && !order?.Revision) || administrador ? false : true
						}
					>
						Devolucion
					</button>
				)
			) : (
				<></>
			)}

			<button
				className='button buttonEntregado labelSmall'
				onClick={(e) => ActualizarEstado(cambiarEstado, 'Entregado')}
				disabled={
					(logistica && !order?.Revision) || administrador ? false : true
				}
			>
				Entregado
			</button>
			{comprobarEntregado() ? (
				order?.Estado != 'Regresando' && order?.Tipo != 'Domicilio' ? (
					order?.Estado != 'En Retorno' ? (
						<button
							className='button buttonRetorno labelSmall'
							onClick={(e) => ActualizarEstado(cambiarEstado, 'En Retorno')}
							disabled={
								(logistica && !order?.Revision) || administrador ? false : true
							}
						>
							En retorno
						</button>
					) : (
						<button
							className='button buttonDevolucion labelSmall'
							onClick={(e) => ActualizarEstado(cambiarEstado, 'Retornado')}
							disabled={
								(logistica && !order?.Revision) || administrador ? false : true
							}
						>
							Retornado
						</button>
					)
				) : (
					<></>
				)
			) : (
				<></>
			)}

			<Bloqueador
				array={order?.Procesos}
				valueElement='Distribucion'
				llave='Tipo'
			/>
		</div>
	);
};
