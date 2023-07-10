import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { useMutateUpdateOrder } from '../../app/hooks/Pedidos';
import { useMutateProcess } from '../../app/hooks/Procesos';

import './AdminOptions.css';

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

export const AdminOptions = ({ order }) => {
	const { PonerEnRevision, ActualizarPedido, cambioExitoso, errorDatos } =
		useNotificationsFeedback();

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

	const cambiarEstado = (estado) => {
		if (order.Estado == estado)
			return errorDatos('El pedido se encuentra actualmente en ese estado');

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
					if (estado == 'Cancelado')
						text = 'El pedido se encuentra cancelado por ';
					if (estado == 'Retenido')
						text = 'El pedido se encuentra retenido por ';
					if (estado == 'En Retorno') {
						text = `El pedido se le ha asignado la transportadora ${order?.Despacho?.TransportadoraRetorno} con el numero de guia ${order?.Despacho?.GuiaRetorno} para su retorno por `;
					}

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

					cambioExitoso();
				},
			}
		);
	};

	const cambiarAtributo = (estado) => {
		console.log(estado);
		if (order.Revision == estado)
			return estado == 1
				? errorDatos('El pedido ya se encuentra en revision')
				: errorDatos('El pedido no se encuentra en revision');

		mutateOrder(
			{
				id: order.Id,
				cedula: order.CedulaCliente,
				fecha: order.Fecha,
				put: {
					Revision: estado,
				},
			},
			{
				onSuccess: () => {
					let text = 'El pedido ha sido puesto en revision por ';
					let tipo = 'En revision';
					if (estado == 0) {
						text = 'El pedido ha sido terminado su revision por ';
						tipo = 'Terminar revision';
					}

					mutateProcess({
						Tipo: tipo,
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
					cambioExitoso();
				},
			}
		);
	};

	return (
		<div className='AdminOptions'>
			<button
				className='button buttonCancelado labelSmall'
				onClick={(e) => ActualizarPedido(cambiarEstado, 'Cancelado')}
			>
				Cancelado
			</button>
			<button
				className='button buttonRevision labelSmall'
				onClick={(e) => PonerEnRevision(cambiarAtributo, 1)}
			>
				En revision
			</button>
			<button
				className='button buttonNoRevision labelSmall'
				onClick={(e) => PonerEnRevision(cambiarAtributo, 0)}
			>
				Terminar revision
			</button>
		</div>
	);
};
