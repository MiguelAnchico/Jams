import { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import close from '../../assets/images/close.png';
import { useMutateUpdatePayment } from '../../app/hooks/Pagos';
import { useMutateUpdateOrder } from '../../app/hooks/Pedidos';
import { useMutateProcess } from '../../app/hooks/Procesos';

import { ImageContainer } from './ImageContainer/ImageContainer';
import { FormInput } from '../FormOrder/FormInput/FormInput';
import './PaymentView.css';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { CardInvoice } from '../CardInvoice/CardInvoice';
import { Roles } from '../../app/hooks/Role';

import iconReport from '../../assets/images/advertencia.png';
import { Apartado } from '../Apartado/Apartado';

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

export const PaymentView = ({ payment, order }) => {
	const [visible, setVisible] = useState(false);
	const [factura, setFactura] = useState(false);
	const {
		CambiarAfacturado,
		cambioExitoso,
		errorDatos,
		ReportarPagos,
		cancelar,
	} = useNotificationsFeedback();

	const { administrador, logistica, cajero, contador, asesor } = Roles();

	const {
		mutate: mutatePayment,
		isLoading: isLoadingPayment,
		error: errorPayment,
	} = useMutateUpdatePayment();
	const {
		mutate: mutateOrder,
		isLoading: isLoadingOrder,
		error: errorOrder,
	} = useMutateUpdateOrder();

	const {
		mutate: mutateProcess,
		isLoading,
		errorUpdateProcess,
	} = useMutateProcess();

	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm();

	const disableCheck = (pago) => {
		let noSePuedeUsar = false;
		if (pago?.Medio == 'Droppi') return (noSePuedeUsar = true);
		if (pago?.Medio == 'DiliExpress') return (noSePuedeUsar = true);

		return noSePuedeUsar;
	};

	const eliminarFactura = () => {
		mutateOrder(
			{
				id: order?.Id,
				cedula: order?.CedulaCliente,
				fecha: order?.Fecha,
				put: {
					Facturado: 0,
					NumeroFactura: '',
				},
			},
			{
				onSuccess: () => {
					let text = 'La factura ha sido cancelada por ';
					mutateProcess(
						{
							Tipo: 'Cancelacion de Factura',
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
								cambioExitoso();
							},
						}
					);
				},
			}
		);
	};

	const changePaymentState = (e, pago) => {
		mutatePayment(
			{
				id: pago?.IdPedido,
				cedula: pago?.CedulaPedido,
				fecha: pago?.FechaPedido,
				tipo: pago?.Nombre,
				medio: pago?.Medio,
				idPago: pago?.IdPagos,
				put: {
					Confirmado: e.target.checked ? 1 : 0,
				},
			},
			{
				onSuccess: () => {
					cambioExitoso();
				},
			}
		);
	};

	const reportarPago = (nombre, medio, valor) => {
		let text =
			'Debe de corregir el pago: ' +
			'\n' +
			'Tipo: ' +
			nombre +
			'Medio: ' +
			'\n' +
			medio +
			'Valor: ' +
			'\n' +
			valor +
			'\n';

		mutateProcess(
			{
				Tipo: 'Correción',
				CedulaCliente: order.CedulaCliente,
				Fecha: order.Fecha,
				Id: order.Id,
				FechaProceso: dateNow(new Date()),
				Contexto:
					text +
					'Reportado por ' +
					localStorage.getItem('nombre') +
					' #' +
					localStorage.getItem('id'),
			},
			{
				onSuccess: () => {
					mutateOrder(
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

	const onSubmit = (data) => {
		CambiarAfacturado(submit, data);
	};

	const submit = (data) => {
		let confirmados = true;
		let pendientePago = true;
		payment.map((pago) => {
			confirmados = pago.Confirmado ? confirmados : false;
			pendientePago = pago.Medio != 'Pendiente Pago' ? pendientePago : false;
		});

		if (!confirmados) return errorDatos('Debe confirmar los pagos');
		if (!pendientePago)
			return errorDatos('No puede facturar una factura pendiente de pago');
		if (order.Facturado)
			return errorDatos('El pedido ya se encuentra facturado');

		mutateOrder(
			{
				id: payment[0]?.IdPedido,
				cedula: payment[0]?.CedulaPedido,
				fecha: payment[0]?.FechaPedido,
				put: {
					Facturado: 1,
					NumeroFactura: data.nroFactura,
				},
			},
			{
				onSuccess: () => {
					let text =
						'El pedido ha sido facturado con el consecutivo ' +
						data.nroFactura +
						' por ';
					mutateProcess(
						{
							Tipo: 'Facturado',
							CedulaCliente: payment[0]?.CedulaPedido,
							Fecha: payment[0]?.FechaPedido,
							Id: payment[0]?.IdPedido,
							FechaProceso: dateNow(new Date()),
							Contexto:
								text +
								localStorage.getItem('nombre') +
								' #' +
								localStorage.getItem('id'),
						},
						{
							onSuccess: () => {
								cambioExitoso();
							},
						}
					);
				},
			}
		);
	};
	return (
		<div className='PaymentView'>
			<div
				class='background'
				onClick={(e) => setVisible(false)}
				style={!visible ? { display: 'none' } : {}}
			></div>
			<button
				className='button buttonCajero labelSmall'
				onClick={(e) => setVisible(true)}
			>
				Metodos de pagos
			</button>
			<div
				className='ModalPaymentView'
				style={!visible ? { display: 'none' } : {}}
			>
				{payment && !factura ? (
					<>
						<img
							src={close}
							className='CloseModal'
							onClick={(e) => setVisible(false)}
						/>
						{payment.map((pago) => (
							<div className='ModalPaymentViewContainer'>
								<ImageContainer pago={pago} />

								<div className='ModalPaymentContainer'>
									<div>
										<p className='bodySmall'>Tipo de Pago</p>
										<p className='headlineSmall'>{pago?.Nombre}</p>
									</div>
									<div>
										<p className='bodySmall'>Medio</p>
										<p className='labelSmall'>{pago?.Medio}</p>
									</div>
								</div>
								<div className='ModalPaymentContainer'>
									<div>
										<p className='bodySmall'>Valor</p>
										<p className='labelSmall'>
											{new Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
												minimumFractionDigits: 0,
											}).format(
												parseFloat(pago?.Valor) +
													parseFloat(
														order?.ComicionDroppi && pago.Medio == 'Droppi'
															? order?.ComicionDroppi
															: 0
													)
											)}
										</p>
									</div>
									<div>
										<p className='bodySmall'>Fecha</p>
										<p className='headlineSmall'>
											{new Date(pago?.FechaPago).toLocaleDateString('es-CO')}
										</p>
									</div>
								</div>
								<div className='ModalPaymentActions'>
									<img
										src={iconReport}
										onClick={(e) =>
											ReportarPagos(
												reportarPago,
												pago?.Nombre,
												pago?.Medio,
												pago?.Valor
											)
										}
										style={{ width: '48px', height: '48px' }}
									/>
									<div className='ModalPaymentSwitch'>
										{((contador || (cajero && pago?.Nombre == 'Cartera')) &&
											!order?.Revision) ||
										administrador ? (
											<label class='switch'>
												<input
													onChange={(e) => changePaymentState(e, pago)}
													type='checkbox'
													disabled={disableCheck(pago)}
													defaultChecked={
														pago?.Confirmado ? pago?.Confirmado : ''
													}
												/>
												<span class='slider round'></span>
											</label>
										) : (
											<></>
										)}
									</div>
								</div>
							</div>
						))}
					</>
				) : (
					<></>
				)}

				<CardInvoice order={order} setFactura={setFactura} />
				<Apartado order={order} setFactura={setFactura} />
				{order?.Apartado
					? 'El consecutivo de la factura para separado es ' +
					  order?.nroApartado
					: ''}

				{!factura && (cajero || contador) ? (
					<>
						<form onSubmit={handleSubmit(onSubmit)}>
							<FormInput
								register={register}
								errors={errors}
								required={true}
								type={'text'}
								nameLabel={'Numero de factura*'}
								nameInput={'Numero de factura'}
								name={'nroFactura'}
								errorMessage={'La factura'}
								max={25}
								min={5}
							/>
							<button
								className='button labelMedium'
								disabled={!(!order?.Revision || administrador)}
							>
								{' '}
								Facturar{' '}
							</button>
						</form>
						{order.Facturado ? (
							<button
								className='button buttonCancelado labelMedium'
								style={{ marginTop: '16px' }}
								onClick={(e) => cancelar(eliminarFactura, 'la factura')}
								disabled={!(!order?.Revision || administrador)}
							>
								Eliminar Factura
							</button>
						) : (
							<></>
						)}
					</>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};
