import React, { useState } from 'react';

import { InputReport } from './InputReport/InputReport';
import './InfoPedido.css';

import deleteIcon from '../../assets/images/close.png';
import { useMutateProcess } from '../../app/hooks/Procesos';
import { useMutateUpdateOrder } from '../../app/hooks/Pedidos';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { useNavigate } from 'react-router-dom';
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

export const InfoPedido = ({ order }) => {
	const navigate = useNavigate();
	const { ActualizarEstado, errorDatos } = useNotificationsFeedback();
	const [nombre, setNombre] = useState('');
	const [cedula, setCedula] = useState('');
	const [whatsapp, setWhatsapp] = useState('');
	const [correo, setCorreo] = useState('');
	const [tipoEnvio, setTipoEnvio] = useState('');
	const [departamento, setDepartamento] = useState('');
	const [ciudad, setCiudad] = useState('');
	const [direccion, setDireccion] = useState('');
	const [costo, setCosto] = useState('');

	const { administrador, logistica, cajero, contador, asesor } = Roles();

	const handleReset = (setHook) => {
		setHook('');
	};

	const {
		mutate: mutateProcess,
		isLoading,
		errorUpdateProcess,
	} = useMutateProcess();
	const {
		mutate: mutateUpdateOrder,
		isLoadingUpdateOrder,
		errorUpdateOrder,
	} = useMutateUpdateOrder();

	const newProcess = () => {
		let text = 'Debe de corregir los campos: ' + '\n';
		text += nombre && 'Nombre' + '\n';
		text += cedula && 'Cedula' + '\n';
		text += whatsapp && 'Whatsapp' + '\n';
		text += correo && 'Correo' + '\n';
		text += tipoEnvio && 'Tipo de Envio' + '\n';
		text += departamento && 'Departamento' + '\n';
		text += ciudad && 'Ciudad' + '\n';
		text += direccion && 'Direccion' + '\n';
		text += costo && 'Costo de envio';

		mutateProcess(
			{
				Tipo: 'Correción',
				CedulaCliente: order.CedulaCliente,
				Fecha: order.Fecha,
				Id: order.Id,
				FechaProceso: dateNow(new Date()),
				Contexto:
					text +
					' reportado por ' +
					localStorage.getItem('nombre') +
					' #' +
					localStorage.getItem('id'),
			},
			{
				onSuccess: () => {
					mutateUpdateOrder(
						{
							id: localStorage.getItem('orderId'),
							cedula: localStorage.getItem('orderCedula'),
							fecha: localStorage.getItem('orderFecha'),
							put: {
								Corregir: 1,
							},
						},
						{
							onSuccess: () => {
								setNombre('');
								setCedula('');
								setWhatsapp('');
								setCorreo('');
								setTipoEnvio('');
								setDepartamento('');
								setCiudad('');
								setDireccion('');
								setCosto('');
							},
						}
					);
				},
			}
		);
	};

	const separarPedido = () => {
		let text = 'El pedido ha sido separado por ';

		if (order.Estado != 'Creado')
			return errorDatos('El pedido ya ha fue separado');

		mutateUpdateOrder(
			{
				id: localStorage.getItem('orderId'),
				cedula: localStorage.getItem('orderCedula'),
				fecha: localStorage.getItem('orderFecha'),
				put: {
					Estado: 'Separado',
				},
			},
			{
				onSuccess: () => {
					mutateProcess({
						Tipo: 'Separado',
						CedulaCliente: order.CedulaCliente,
						Fecha: order.Fecha,
						Id: order.Id,
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

	const generarObservaciones = () => {
		let text = '';

		order?.Productos?.map((producto) => {
			text += producto.CodigoProducto + ' -- ';
		});

		text += 'C.C ' + order.CedulaCliente;

		return text;
	};

	const generarPrecioVenta = () => {
		let price = 0;
		if (order?.ComicionDroppi) {
			order?.Pagos?.map((pago) => {
				if (pago.Medio === 'Droppi') return (price = pago.Valor);
			});

			price = parseFloat(price) + parseFloat(order?.ComicionDroppi);
		} else {
			order?.Productos?.map((producto) => {
				price += producto.Valor;
			});

			price += order?.CostoEnvio;
		}

		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(price);
	};

	return (
		<div className='InfoPedido'>
			<p className='bodySmall'>1. Revisión de estado</p>
			<p className='labelLarge'>
				Revise que la información digitada por el asesor sea correcta
			</p>
			<div className='InfoPedidoMultiContainer'>
				<InputReport
					fieldTitle={'Nombre'}
					fieldValue={order?.NombreCliente}
					fieldHook={setNombre}
				/>
				<InputReport
					fieldTitle={'Cedula'}
					fieldValue={order?.CedulaCliente}
					fieldHook={setCedula}
				/>
			</div>
			<div className='InfoPedidoMultiContainer'>
				<InputReport
					fieldTitle={'Whatsapp'}
					fieldValue={order?.Whatsapp}
					fieldHook={setWhatsapp}
				/>
				<InputReport
					fieldTitle={'Correo'}
					fieldValue={order?.Correo}
					fieldHook={setCorreo}
				/>
			</div>
			<InputReport
				fieldTitle={'Tipo de envio'}
				fieldValue={order?.Tipo}
				fieldHook={setTipoEnvio}
			/>

			{order?.Tipo === 'Recogen' && <></>}
			{order?.Tipo === 'Domicilio' && (
				<>
					<div className='InfoPedidoMultiContainer'>
						<InputReport
							fieldTitle={'Departamento'}
							fieldValue={order?.Domicilio?.Departamento}
							fieldHook={setDepartamento}
						/>
						<InputReport
							fieldTitle={'Ciudad'}
							fieldValue={order?.Domicilio?.Ciudad}
							fieldHook={setCiudad}
						/>
					</div>
					<InputReport
						fieldTitle={'Direccion'}
						fieldValue={order?.Domicilio?.Direccion}
						fieldHook={setDireccion}
					/>
				</>
			)}
			{order?.Tipo === 'Despacho' && (
				<>
					<div className='InfoPedidoMultiContainer'>
						<InputReport
							fieldTitle={'Departamento'}
							fieldValue={order?.Despacho?.Departamento}
							fieldHook={setDepartamento}
						/>
						<InputReport
							fieldTitle={'Ciudad'}
							fieldValue={order?.Despacho?.Ciudad}
							fieldHook={setCiudad}
						/>
					</div>
					<InputReport
						fieldTitle={'Direccion'}
						fieldValue={order?.Despacho?.Direccion}
						fieldHook={setDireccion}
					/>
				</>
			)}

			<InputReport
				fieldTitle={'Costo de envio'}
				fieldValue={order?.CostoEnvio}
				fieldHook={setCosto}
			/>

			<button
				className='button buttonLogistica labelSmall'
				onClick={() => navigate('/edit-order')}
				disabled={(asesor && !order?.Revision) || administrador ? false : true}
			>
				Editar orden
			</button>

			{order?.Tipo === 'Despacho' ? (
				<div className='OrderResume'>
					<p className='labelMedium TitleOrderResume'>
						Informacion para agregar en la guia de dropi
					</p>
					<p className='bodySmall OP6'>
						Tipo de guia:{' '}
						<span className='headlineSmall'>
							{order?.ComicionDroppi ? 'Con recaudo' : 'Sin recaudo'}
						</span>
					</p>
					<p className='bodySmall OP6'>
						Observaciones:{' '}
						<span className='headlineSmall'>{generarObservaciones()}</span>
					</p>
					<p className='bodySmall OP6'>
						Precio de venta:{' '}
						<span className='headlineSmall'>{generarPrecioVenta()}</span>
					</p>
				</div>
			) : (
				<></>
			)}

			{(nombre ||
				cedula ||
				whatsapp ||
				correo ||
				tipoEnvio ||
				departamento ||
				ciudad ||
				direccion ||
				costo) && (
				<div className='ReportInputs'>
					{nombre && (
						<div className='ReportInputField'>
							<p className='bodySmall'>
								Corregir el campo
								<span className='headlineSmall'> Nombre</span>
							</p>
							<img
								className='InfoPedidoIcon'
								onClick={(e) => handleReset(setNombre)}
								src={deleteIcon}
							/>
						</div>
					)}
					{cedula && (
						<div className='ReportInputField'>
							<p className='bodySmall'>
								Corregir el campo
								<span className='headlineSmall'> Cedula</span>
							</p>
							<img
								className='InfoPedidoIcon'
								src={deleteIcon}
								onClick={(e) => handleReset(setCedula)}
							/>
						</div>
					)}
					{whatsapp && (
						<div className='ReportInputField'>
							<p className='bodySmall'>
								Corregir el campo
								<span className='headlineSmall'> Whatsapp</span>
							</p>
							<img
								className='InfoPedidoIcon'
								src={deleteIcon}
								onClick={(e) => handleReset(setWhatsapp)}
							/>
						</div>
					)}
					{correo && (
						<div className='ReportInputField'>
							<p className='bodySmall'>
								Corregir el campo
								<span className='headlineSmall'> Correo</span>
							</p>
							<img
								className='InfoPedidoIcon'
								src={deleteIcon}
								onClick={(e) => handleReset(setCorreo)}
							/>
						</div>
					)}
					{tipoEnvio && (
						<div className='ReportInputField'>
							<p className='bodySmall'>
								Corregir el campo
								<span className='headlineSmall'> Tipo de Envio</span>
							</p>
							<img
								className='InfoPedidoIcon'
								src={deleteIcon}
								onClick={(e) => handleReset(setTipoEnvio)}
							/>
						</div>
					)}
					{departamento && (
						<div className='ReportInputField'>
							<p className='bodySmall'>
								Corregir el campo
								<span className='headlineSmall'> Departamento</span>
							</p>
							<img
								className='InfoPedidoIcon'
								src={deleteIcon}
								onClick={(e) => handleReset(setDepartamento)}
							/>
						</div>
					)}
					{ciudad && (
						<div className='ReportInputField'>
							<p className='bodySmall'>
								Corregir el campo
								<span className='headlineSmall'> Ciudad</span>
							</p>
							<img
								className='InfoPedidoIcon'
								src={deleteIcon}
								onClick={(e) => handleReset(setCiudad)}
							/>
						</div>
					)}
					{direccion && (
						<div className='ReportInputField'>
							<p className='bodySmall'>
								Corregir el campo
								<span className='headlineSmall'> Direccion</span>
							</p>
							<img
								className='InfoPedidoIcon'
								src={deleteIcon}
								onClick={(e) => handleReset(setDireccion)}
							/>
						</div>
					)}
					{costo && (
						<div className='ReportInputField'>
							<p className='bodySmall'>
								Corregir el campo
								<span className='headlineSmall'> Costo</span>
							</p>
							<img
								className='InfoPedidoIcon'
								src={deleteIcon}
								onClick={(e) => handleReset(setCosto)}
							/>
						</div>
					)}

					<button
						className='button labelSmall'
						onClick={(e) => ActualizarEstado(newProcess, 'Corregir')}
						disabled={
							(logistica && !order?.Revision) || administrador ? false : true
						}
					>
						Reportar
					</button>
				</div>
			)}
			<button
				className='button buttonSeparado labelMedium'
				onClick={(e) => ActualizarEstado(separarPedido, 'Separado')}
				disabled={
					(!order?.Revision && logistica) || administrador ? false : true
				}
			>
				Actualizar a Separado
			</button>
		</div>
	);
};
