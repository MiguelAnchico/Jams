import { useNotificationsFeedback } from '../../../app/hooks/NotificationFeedback';
import { useMutateUpdateOrder } from '../../../app/hooks/Pedidos';
import { useMutateProcess } from '../../../app/hooks/Procesos';
import { useMutateUpdateProduct } from '../../../app/hooks/Productos';
import { Roles } from '../../../app/hooks/Role';
import './CardProductOrder.css';

import { urlimage } from '../../../app/api/Config';

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

export const CardProductOrder = ({ producto, order }) => {
	const { ActualizarEstado, ActualizarPedido, errorDatos, ReportarProducto } =
		useNotificationsFeedback();

	const { administrador, logistica, cajero, contador, asesor } = Roles();
	const {
		mutate: mutateProduct,
		isLoadingProduct,
		errorProduct,
	} = useMutateUpdateProduct();

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
		if (estado != 'Sin Disponibilidad' && estado != 'Corregir') {
			mutateProduct({
				id: producto.IdPedido,
				cedula: producto.CedulaPedido,
				fecha: producto.FechaPedido,
				codigo: producto.CodigoProducto,
				medida: producto.Medida,
				color: producto.Color,
				IdProducto: producto.IdProducto,
				put: {
					Estado: estado,
				},
			});
		} else {
			if (estado == 'Corregir') {
				ReportarProducto(corregirPedido);
			} else {
				ActualizarPedido(cambiarEstadoPedido, 'Retenido');
			}
		}
	};

	const corregirPedido = () => {
		mutateProduct(
			{
				id: producto.IdPedido,
				cedula: producto.CedulaPedido,
				fecha: producto.FechaPedido,
				codigo: producto.CodigoProducto,
				medida: producto.Medida,
				color: producto.Color,
				IdProducto: producto.IdProducto,
				put: {
					Estado: 'Corregir',
				},
			},
			{
				onSuccess: () => {
					let text =
						'El producto con el codigo ' +
						producto.CodigoProducto +
						', de medida ' +
						producto.Medida +
						' debe ser corregido, reportado por';
					mutateProcess({
						Tipo: 'Corregir',
						Id: localStorage.getItem('orderId'),
						CedulaCliente: localStorage.getItem('orderCedula'),
						Fecha: localStorage.getItem('orderFecha'),
						FechaProceso: dateNow(new Date()),
						Contexto:
							text +
							localStorage.getItem('nombre') +
							' #' +
							localStorage.getItem('id'),
					});

					if (order?.Corregir) return;
					mutateOrder({
						id: localStorage.getItem('orderId'),
						cedula: localStorage.getItem('orderCedula'),
						fecha: localStorage.getItem('orderFecha'),
						put: {
							Corregir: 1,
						},
					});
				},
			}
		);
	};

	const cambiarEstadoPedido = () => {
		mutateProduct(
			{
				id: producto.IdPedido,
				cedula: producto.CedulaPedido,
				fecha: producto.FechaPedido,
				codigo: producto.CodigoProducto,
				medida: producto.Medida,
				color: producto.Color,
				IdProducto: producto.IdProducto,
				put: {
					Estado: 'Retenido',
				},
			},
			{
				onSuccess: () => {
					if (order?.Estado == 'Retenido') return;
					mutateOrder({
						id: localStorage.getItem('orderId'),
						cedula: localStorage.getItem('orderCedula'),
						fecha: localStorage.getItem('orderFecha'),
						put: {
							Estado: 'Retenido',
						},
					});

					let text = 'El pedido ha sido retenido por ';
					mutateProcess({
						Tipo: 'Retenido',
						Id: localStorage.getItem('orderId'),
						CedulaCliente: localStorage.getItem('orderCedula'),
						Fecha: localStorage.getItem('orderFecha'),
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
	return (
		<div className='CardProductOrder'>
			<div className='CardProductOrderImage'>
				<img src={urlimage + producto?.Foto} />
			</div>
			<p className='headlineSmall OP6' style={{ textAlign: 'center' }}>
				{producto?.NombreProducto}
			</p>
			<div className='CardProductOrderContent'>
				<div className='CardProductOrderSpecs'>
					<p className='bodySmall'>Codigo</p>
					<span className='headlineSmall'>{producto?.CodigoProducto}</span>
				</div>
				<div className='CardProductOrderSpecs'>
					<p className='bodySmall'>Medida</p>
					<span className='headlineSmall'>{producto?.Medida}</span>
				</div>
				<div className='CardProductOrderSpecs'>
					<p className='bodySmall'>Color</p>
					<span className='headlineSmall'>{producto?.Color}</span>
				</div>
			</div>
			<select
				onChange={(e) => ActualizarEstado(cambiarEstado, e.target.value)}
				className='select bodySmall'
				disabled={
					(logistica && !order?.Revision) || administrador ? false : true
				}
			>
				<option selected disabled hidden>
					Seleccione el estado del producto
				</option>
				<option className='labelSmall' value='Sin Disponibilidad'>
					Sin Disponibilidad
				</option>
				<option className='labelSmall' value='Cambiando Talla'>
					Cambiando Talla
				</option>
				<option className='labelSmall' value='En 2da Bodega'>
					En 2da Bodega
				</option>
				<option className='labelSmall' value='Disponible'>
					Disponible
				</option>
				<option className='labelSmall' value='Corregir'>
					Corregir
				</option>
			</select>

			<div className='CardProductOrderFooter labelSmall'>
				{producto?.Estado}
			</div>
		</div>
	);
};
