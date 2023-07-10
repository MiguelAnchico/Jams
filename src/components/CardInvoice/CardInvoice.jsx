import './CardInvoice.css';
import close from '../../assets/images/close.png';
import { useState } from 'react';
import { urlimage } from '../../app/api/Config';

import { DateFormatter } from '../../utils/DateFormatter';

export const CardInvoice = ({ order, setFactura }) => {
	const [visible, setVisible] = useState(false);
	const [showEnvio, setShowEnvio] = useState(true);

	const onChangeVisible = (value) => {
		setVisible(value);
		setFactura(value);
	};

	const comprobarEnvio = () => {
		let coinciden = false;
		if (order?.Tipo != 'Domicilio') return;

		order?.Pagos?.map((pago) => {
			if (pago.Medio == 'DiliExpress') return (coinciden = pago.Valor);
		});

		return coinciden;
	};
	return (
		<div className='CardInvoice'>
			{visible ? (
				<div className='CardInvoiceModal'>
					<img
						src={close}
						className='CloseModal'
						onClick={(e) => onChangeVisible(false)}
					/>
					<h3>Pedido {order?.Id}</h3>
					<h6>Cliente</h6>
					<div className='ClienteInfo'>
						<div>
							<p className='bodySmall'>Nombre completo</p>
							<span className='headlineSmall'>{order?.NombreCliente}</span>
						</div>
						<div>
							<p className='bodySmall'>Cedula</p>
							<span className='headlineSmall'>{order?.CedulaCliente}</span>
						</div>
						<div>
							<p className='bodySmall'>Numero de celular</p>
							<span className='headlineSmall'>{order?.Whatsapp}</span>
						</div>
						<div>
							<p className='bodySmall'>Direccion</p>
							<span className='headlineSmall'>
								{order?.Tipo == 'Despacho'
									? order?.Despacho?.Direccion
									: order?.Tipo == 'Domicilio'
									? order?.Domicilio?.Direccion
									: 'N/A'}
							</span>
						</div>
						<div>
							<p className='bodySmall'>Departamento</p>
							<span className='headlineSmall'>
								{order?.Tipo == 'Despacho'
									? order?.Despacho?.Departamento
									: order?.Tipo == 'Domicilio'
									? order?.Domicilio?.Departamento
									: 'N/A'}
							</span>
						</div>
						<div>
							<p className='bodySmall'>Ciudad</p>
							<span className='headlineSmall'>
								{order?.Tipo == 'Despacho'
									? order?.Despacho?.Ciudad
									: order?.Tipo == 'Domicilio'
									? order?.Domicilio?.Ciudad
									: 'N/A'}
							</span>
						</div>
						<div>
							<p className='bodySmall'>Tipo de pedido</p>
							<span className='headlineSmall'>{order?.Tipo}</span>
						</div>
					</div>
					<h6>Productos</h6>
					<div class='CardInvoiceProductos'>
						<p className='headlineSmall'>Codigo</p>
						<p className='headlineSmall'>Foto</p>
						<p className='headlineSmall'>Precio sin Iva</p>
						<p className='headlineSmall'>Precio con Iva</p>
						{order?.Productos?.map((producto) => (
							<>
								<p className='bodySmall'>{producto.CodigoProducto}</p>
								<img src={urlimage + producto.Foto} />
								<p className='bodySmall'>
									{new Intl.NumberFormat('en-US', {
										style: 'currency',
										currency: 'USD',
										minimumFractionDigits: 0,
									}).format(Math.round(producto.Valor / 1.19))}
								</p>
								<p className='bodySmall'>
									{new Intl.NumberFormat('en-US', {
										style: 'currency',
										currency: 'USD',
										minimumFractionDigits: 0,
									}).format(producto.Valor)}
								</p>
							</>
						))}
						<p className='headlineSmall'>Envio</p>
						<p className='bodySmall'>N/A</p>
						<p className='bodySmall'>N/A</p>
						<p className='bodySmall'>
							{comprobarEnvio()
								? order?.CostoEnvio < comprobarEnvio()
									? 0
									: new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: 'USD',
											minimumFractionDigits: 0,
									  }).format(
											parseFloat(order?.CostoEnvio) +
												parseFloat(-comprobarEnvio()) +
												parseFloat(
													order?.ComicionDroppi ? order?.ComicionDroppi : 0
												)
									  )
								: new Intl.NumberFormat('en-US', {
										style: 'currency',
										currency: 'USD',
										minimumFractionDigits: 0,
								  }).format(
										parseFloat(order?.CostoEnvio) +
											parseFloat(
												order?.ComicionDroppi ? order?.ComicionDroppi : 0
											)
								  )}
						</p>
					</div>
					<div className='CardInvoicePagos'>
						<p className='headlineSmall'>Codigo</p>
						<p className='headlineSmall'>Medio</p>
						<p className='headlineSmall'>Foto</p>
						<p className='headlineSmall'>Fecha de pago</p>
						<p className='headlineSmall'>Valor</p>
						<p className='headlineSmall'>Confirmado</p>
						{order?.Pagos?.map((pago) => {
							if (pago.Medio == 'DiliExpress' && comprobarEnvio()) {
								if (pago.Valor != order.CostoEnvio)
									return (
										<>
											<p className='bodySmall'>{pago.Nombre}</p>
											<p className='bodySmall'>{pago.Medio}</p>
											<img src={urlimage + pago.Foto} />
											<p className='bodySmall'>
												{pago.FechaPago
													? new Date(pago.FechaPago).toLocaleString('es-CO')
													: 'N/A'}
											</p>
											<p className='bodySmall'>
												{new Intl.NumberFormat('en-US', {
													style: 'currency',
													currency: 'USD',
													minimumFractionDigits: 0,
												}).format(
													pago.Medio == 'Droppi'
														? parseFloat(order.ComicionDroppi) +
																parseFloat(pago.Valor)
														: pago.Valor - order.CostoEnvio
												)}
											</p>
											<p className='bodySmall'>
												{pago?.Confirmado ? 'Si' : 'No'}
											</p>
										</>
									);
							} else {
								return (
									<>
										<p className='bodySmall'>{pago.Nombre}</p>
										<p className='bodySmall'>{pago.Medio}</p>
										<img src={urlimage + pago.Foto} />
										<p className='bodySmall'>
											{pago.FechaPago
												? new Date(pago.FechaPago).toLocaleString('es-CO')
												: 'N/A'}
										</p>
										<p className='bodySmall'>
											{new Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: 'USD',
												minimumFractionDigits: 0,
											}).format(
												pago.Medio == 'Droppi'
													? parseFloat(order.ComicionDroppi) +
															parseFloat(pago.Valor)
													: pago.Valor
											)}
										</p>
										<p className='bodySmall'>
											{pago?.Confirmado ? 'Si' : 'No'}
										</p>
									</>
								);
							}
						})}
					</div>
				</div>
			) : (
				<></>
			)}

			{!visible ? (
				<button
					className='button buttonLogistica CardInvoiceButton labelSmall'
					onClick={(e) => onChangeVisible(true)}
				>
					Mostrar resumen factura
				</button>
			) : (
				<></>
			)}
		</div>
	);
};
