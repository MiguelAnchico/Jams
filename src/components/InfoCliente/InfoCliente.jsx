import { useMutateUpdateOrder } from '../../app/hooks/Pedidos';
import { useMutateProcess } from '../../app/hooks/Procesos';
import './InfoCliente.css';
import { Bloqueador } from '../Bloqueador/Bloqueado';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { Roles } from '../../app/hooks/Role';
import { useMutateUpdateDelivery } from '../../app/hooks/Domicilios';

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

export const InfoCliente = ({ order }) => {
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

	const {
		mutate: mutateDelivery,
		isLoading: isLoadingUpdateDelivery,
		errorUpdateDelivery,
	} = useMutateUpdateDelivery();

	const { administrador, logistica, cajero, contador, asesor } = Roles();

	const cambiarEstado = (estado) => {
		let text;
		let tipo;
		if (order?.Estado == 'Distribucion')
			return errorDatos('El pedido se encuentra actualmente en ese estado');

		if (order?.Tipo == 'Despacho')
			if (!order?.Despacho?.Guia)
				return errorDatos(
					'Primero debe de agregar la guia y transportadora del pedido'
				);

		if (order?.Despacho?.Guia == 'Cancelado')
			return errorDatos('Debes de agregar la guia de reenvio');

		if (order?.Tipo != 'Domicilio') {
			text = `El pedido ha sido entregado a la tranportadora ${order?.Despacho?.Transportadora} con el numero de guia ${order?.Despacho?.Guia} por `;
			tipo = 'Distribucion';
		} else {
			text = `El pedido ha sido enviado entregado al repartidor por`;
			tipo = 'Distribucion';
		}

		if (order?.Estado == 'Devolucion' && order?.Tipo != 'Domicilio') {
			text = `El pedido se le ha asignado la transportadora ${order?.Despacho?.Transportadora} con el numero de guia ${order?.Despacho?.Guia} para su reenvio por `;
			tipo = 'Reenvio';
		} else {
			if (
				order?.Estado != 'Empacado' &&
				order?.Estado != 'Retenido' &&
				order?.Estado != 'Retornado' &&
				order?.Tipo != 'Domicilio'
			)
				return errorDatos(
					'No hay registro de que el pedido este en la tienda para realizar el cambio de estado'
				);
		}

		if (
			estado == 'Distribucion' &&
			order?.Estado != 'Empacado' &&
			order?.Estado != 'Devolucion' &&
			order?.Tipo == 'Domicilio'
		)
			return errorDatos('El pedido no se encuentra en la tienda');

		let textCliente;

		if (order?.Tipo == 'Domicilio') {
			textCliente =
				'Buen%20d%C3%ADa,%20soy%20Saray%20del%20%C3%A1rea%20de%20log%C3%ADstica%20de%20Cascos%20PB.%20Tu%20env%C3%ADo%20ya%20va%20en%20camino.';
		} else {
			textCliente =
				'%20Buen%20d%C3%ADa,%20soy%20Saray%20del%20%C3%A1rea%20de%20log%C3%ADstica%20de%20Cascos%20PB.%20Tu%20env%C3%ADo%20ya%20va%20en%20camino%20bajo%20la%20gu%C3%ADa%20N%C2%B0%' +
				order?.Despacho?.Guia +
				'%20por%20la%20transportadora%20SERVIENTREGA%0APuedes%20hacerle%20seguimiento%20mediante%20el%20siguiente%20link:%20https://www.servientrega.com/wps/portal/rastreo-envio/!ut/p/z1/jY9PC4JAEMU_SwevzvgvpNtGUEYaBZHNJTS21VhdWU2_flJdglqa2xt-7z0eEKRAddaXIutKVWdy1CeanoMw8lfoO9tlsvBxt5-7ceKwyIsQjk8AfxxDoH_8BoDM8UcgQ4XLYvcNGDLWQEKq_DWX1bkXCiDNr1xzbd_1-C66rmlnFlo4DIMtlBKS2xdVWfjNUqi2g_SThKY6pHgLZL9hkwdwm1Ut/dz/d5/L2dBISEvZ0FBIS9nQSEh/%20' /*%20El%20envi%C3%B3%20tiene%20un%20costo%20de%20$0%20*/ +
				'%0ARecuerda%20que%20el%20envi%C3%B3%20tarda%20de%202%20a%208%20d%C3%ADas%20h%C3%A1biles';
		}

		window.open(
			'https://wa.me/57' + order?.Whatsapp + '?text=' + textCliente,
			'_blank'
		);

		mutateOrder(
			{
				id: localStorage.getItem('orderId'),
				cedula: localStorage.getItem('orderCedula'),
				fecha: localStorage.getItem('orderFecha'),
				put: {
					Estado: tipo,
				},
			},
			{
				onSuccess: () => {
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

					if (order?.Tipo == 'Domicilio')
						mutateDelivery({
							id: localStorage.getItem('orderId'),
							cedula: localStorage.getItem('orderCedula'),
							fecha: localStorage.getItem('orderFecha'),
							put: {
								Agendado: 0,
								FechaAgendadoInicio: null,
								FechaAgendadoFinal: null,
							},
						});
				},
			}
		);
	};

	return (
		<div className='InfoCliente'>
			<p className='bodySmall'>3. Notificación al cliente</p>
			<h3>¿El pedido se ha enviado al cliente?</h3>
			{order?.Tipo == 'Despacho' ? (
				order?.Despacho?.Guia && order?.Despacho?.Guia != 'Cancelado' ? (
					<div>
						<p className='bodySmall'>
							El pedido se realizara por {order?.Despacho?.Transportadora} con
							el numero de guia: {order?.Despacho?.Guia}
						</p>
					</div>
				) : (
					<div>
						<p className='bodySmall' style={{ color: 'red' }}>
							Para pasar el pedido a distribucion debe primero agregar la guia{' '}
							{order?.Estado == 'En Retorno' ? 'de reenvio' : 'de envio'}
						</p>
					</div>
				)
			) : (
				<></>
			)}
			<button
				className='button buttonNotificacion labelSmall'
				onClick={(e) =>
					ActualizarEstado(
						cambiarEstado,
						order?.Estado == 'En Retorno' ? 'Reenvio' : 'Distribucion'
					)
				}
				disabled={
					(logistica && !order?.Revision) || administrador ? false : true
				}
			>
				Enviar al Cliente
			</button>
			<Bloqueador
				array={order?.Procesos}
				valueElement='Empacado'
				llave='Tipo'
			/>
		</div>
	);
};
