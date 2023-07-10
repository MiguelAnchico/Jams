import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { ProductAdd } from '../ProductAdd/ProductAdd';
import { FormInput } from '../FormOrder/FormInput/FormInput';

import { getDepartments } from '../../app/api/Departamentos';

import '../FormOrder/FormOrder.css';
import { PaymentAdd } from '../PaymentAdd/PaymentAdd';
import {
	useMutateOrder,
	useMutateUpdateOrder,
	useOrder,
} from '../../app/hooks/Pedidos';
import {
	useMutateDeleteProduct,
	useMutateProduct,
} from '../../app/hooks/Productos';
import {
	useMutateDeletePayment,
	useMutatePayment,
} from '../../app/hooks/Pagos';
import {
	useMutateDeleteShipping,
	useMutateShipping,
	useMutateUpdateShipping,
} from '../../app/hooks/Despachos';
import {
	useMutateDeleteDelivery,
	useMutateDelivery,
	useMutateUpdateDelivery,
} from '../../app/hooks/Domicilios';
import {
	useMutateDeleteInPoint,
	useMutateInPoint,
} from '../../app/hooks/Recogen';
import { useMutateProcess } from '../../app/hooks/Procesos';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { Spinner } from '../Spinner/Spinner';
import { urlimage } from '../../app/api/Config';

const selectOptions = [
	{ value: 'Despacho', label: 'Despacho' },
	{ value: 'Domicilio', label: 'Domicilio' },
	{ value: 'Recogen', label: 'Recogen' },
];

const domicilioDepartamento = [
	'Cali',
	'Jamundi',
	'Yumbo',
	'Palmira',
	'Candelaria',
];

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

export const FormEditProducts = ({ order }) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm();

	const {
		mutate: mutateOrder,
		isLoading: isLoagindOrder,
		error: errorOrder,
	} = useMutateUpdateOrder();

	const {
		mutate: mutateProduct,
		error: createErrorProduct,
		isLoading: createLoadingProduct,
	} = useMutateProduct();

	const {
		mutate: mutateDeleteProduct,
		error: deleteErrorProduct,
		isLoading: deleteLoadingProduct,
	} = useMutateDeleteProduct();

	const {
		mutate: mutatePayment,
		error: createErrorPayment,
		isLoading: createLoadingPayment,
	} = useMutatePayment();

	const {
		mutate: mutateDeletePayment,
		error: deleteErrorPayment,
		isLoading: deleteLoadingPayment,
	} = useMutateDeletePayment();

	const {
		mutate: mutateShipping,
		error: createErrorShipping,
		isLoading: createLoadingShipping,
	} = useMutateShipping();

	const {
		mutate: mutateDelivery,
		error: createErrorDelivery,
		isLoading: createLoadingDelivery,
	} = useMutateDelivery();

	const {
		mutate: mutateInPoint,
		error: createErrorInPoint,
		isLoading: createLoadingInPoint,
	} = useMutateInPoint();

	const {
		mutate: mutateDeleteShipping,
		error: deleteErrorShipping,
		isLoading: deleteLoadingShipping,
	} = useMutateDeleteShipping();

	const {
		mutate: mutateDeleteDelivery,
		error: deleteErrorDelivery,
		isLoading: deleteLoadingDelivery,
	} = useMutateDeleteDelivery();

	const {
		mutate: mutateDeleteInPoint,
		error: deleteErrorInPoint,
		isLoading: deleteLoadingInPoint,
	} = useMutateDeleteInPoint();

	const {
		mutate: mutateUpdateShipping,
		error: updateErrorShipping,
		isLoading: updateLoadingShipping,
	} = useMutateUpdateShipping();

	const {
		mutate: mutateUpdateDelivery,
		error: updateErrorDelivery,
		isLoading: updateLoadingDelivery,
	} = useMutateUpdateDelivery();

	const {
		mutate: mutateProcess,
		error: createErrorProcess,
		isLoading: createLoadingProcess,
	} = useMutateProcess();

	const { data, error, isLoading } = useQuery(['departments'], getDepartments);
	const { ActualizarTipoPedido, pedidoActualizado } =
		useNotificationsFeedback();

	const [products, setProducts] = useState([]);
	const [payments, setPayments] = useState([]);
	const [departament, setDepartament] = useState([]);
	const [deliveryType, setDeliveryType] = useState('');
	const [cargarDelivery, setCargarDelivery] = useState(false);
	const [envio, setEnvio] = useState(0);
	const [envioPlus, setEnvioPlus] = useState(undefined);
	const [cambiarPedido, setCambiarPedido] = useState(false);

	const [antiguosProductos, setAntiguosProductos] = useState([]);
	const [antiguosPagos, setAntiguosPagos] = useState([]);

	const [errorProduct, setErrorProduct] = useState([]);
	const [errorPayment, setErrorPayment] = useState([]);

	const calcularEnvioDropi = () => {
		let totalProducts = 0;
		products?.map((product) => {
			totalProducts += parseFloat(product.precio);
		});
		return (
			parseFloat(totalProducts) + parseFloat(envioPlus) + parseFloat(envio)
		);
	};

	//selected={ciudad == order[order?.Tipo]?.Ciudad}

	useEffect(() => {
		setDepartament(
			data
				? order
					? data.filter(
							(departamento) =>
								departamento['departamento'] ==
								order[0][order[0].Tipo].Departamento
					  )[0]
					: []
				: []
		);

		setDeliveryType(order ? order[0].Tipo : []);
		setEnvio(order ? order[0].CostoEnvio : 0);

		data
			? order
				? order[0]?.Productos?.map((producto) => {
						producto['imgPreviewProduct'] = urlimage + producto.Foto;
						producto['codigo'] = producto['CodigoProducto'];
						producto['nombre'] = producto['NombreProducto'];
						producto['medida'] = producto['Medida'];
						producto['color'] = producto['Color'];
						producto['precio'] = producto['Valor'];
						producto['cantidad'] = 1;
						producto['antiguo'] = true;

						delete producto['Foto'];
						delete producto['CodigoProducto'];
						delete producto['NombreProducto'];
						delete producto['Medida'];
						delete producto['Color'];
						delete producto['Valor'];
						delete producto['Cantidad'];
				  })
				: ''
			: '';

		data
			? order
				? order[0]?.Pagos?.map((pago) => {
						pago['previewImage'] = urlimage + pago.Foto;
						pago['tipoPago'] = pago['Nombre'];
						pago['medio'] = pago['Medio'];
						pago['fecha'] = pago['FechaPago'];
						pago['valor'] = pago['Valor'];
						pago['antiguo'] = true;
						if (pago['Medio'] == 'Droppi')
							pago['comisionDroppi'] = order[0].ComicionDroppi;

						delete pago['Nombre'];
						delete pago['Medio'];
						delete pago['FechaPago'];
						delete pago['Valor'];
						delete pago['Foto'];
				  })
				: ''
			: '';
		setProducts(order ? order[0].Productos : []);
		setEnvioPlus(order ? order[0].ComicionDroppi : undefined);
		setAntiguosProductos(order ? order[0].Productos : []);

		setCargarDelivery(order ? true : false);
		setPayments(order ? order[0].Pagos : []);
		setAntiguosPagos(order ? order[0].Pagos : []);
	}, [order, data]);

	useEffect(() => {
		if (deliveryType && cargarDelivery) {
			payments?.map((payment) => {
				if (payment.medio == 'Droppi') setEnvioPlus(0);
			});
			setPayments([]);
		}
	}, [deliveryType]);

	const calcularPrecioDropi = () => {
		let totalProducts = 0;
		products?.map((product) => {
			totalProducts += parseFloat(product.precio);
		});
		return totalProducts;
	};

	const validationPrice = (envio) => {
		let totalProducts = 0;
		let totalPayments = 0;
		let errorPayments = [];
		let errorProducts = [];

		if (products.length > 0) {
			products?.map((product) => {
				totalProducts += parseFloat(product.precio) * product.cantidad;
			});
		}

		if (payments.length > 0) {
			payments?.map((payment) => {
				totalPayments += parseFloat(payment.valor);
			});
		}

		totalProducts += parseFloat(envio);

		if (totalProducts === 0)
			errorProducts.push('Es obligatorio que agregue un producto\n');
		if (totalPayments === 0)
			errorPayments.push('Es obligatorio que agregue un pago\n');

		if (totalPayments > totalProducts)
			errorPayments.push(
				'El valor de los pagos supera al de los productos seleccionados\n'
			);
		if (totalProducts > totalPayments)
			errorPayments.push(
				'El costo de los productos es mayor al valor de los pagos\n'
			);

		setErrorProduct(errorProducts);
		setErrorPayment(errorPayments);

		return (
			totalProducts == totalPayments && totalProducts != 0 && totalPayments != 0
		);
	};

	const elementoPorActualizar = (elemento, array) => {
		let exists = false;
		array.map((elementoAntiguo, index) => {
			if (JSON.stringify(elementoAntiguo) === JSON.stringify(elemento)) {
				array.splice(index, 1);
				exists = true;
			}
		});
		return exists;
	};

	const handleChange = (e) => {
		setDeliveryType(e.target.value);
		if (e.target.value == 'Recogen') setEnvio(0);
	};

	const departmentChange = (e) => {
		setDepartament(
			data.filter(
				(departamento) => departamento['departamento'] == e.target.value
			)[0]
		);
	};

	const onSubmit = (dataForm) => {
		const valorEnvio = deliveryType !== 'Recogen' ? envio : 0;
		let envioDroppi = null;

		if (validationPrice(valorEnvio)) {
			let totalPayments = 0;
			setErrorPayment([]);

			payments?.map((payment) => {
				totalPayments += parseFloat(payment.valor);
			});

			if (envioPlus) envioDroppi = envioPlus;

			mutateOrder(
				{
					id: localStorage.getItem('orderId'),
					cedula: localStorage.getItem('orderCedula'),
					fecha: localStorage.getItem('orderFecha'),
					put: {
						Tipo: dataForm.delivery,
						CostoEnvio: valorEnvio,
						ComicionDroppi: envioDroppi,
						Corregir: 0,
					},
				},
				{
					onSuccess: (data) => {
						let productosPorEliminar = [...antiguosProductos];
						let pagosPorEliminar = [...antiguosPagos];

						products.map((product, index) => {
							let productoCrear = elementoPorActualizar(
								product,
								productosPorEliminar
							);

							product.codigo = product.codigo.replace('/', '-');
							product.nombre = product.nombre.replace('/', '-');
							product.color = product.color.replace('/', '-');
							product.medida = product.medida.replace('/', '-');
							product.codigo = product.codigo.replace('?', '-');
							product.nombre = product.nombre.replace('?', '-');
							product.color = product.color.replace('?', '-');
							product.medida = product.medida.replace('?', '-');

							if (!productoCrear) {
								mutateProduct({
									CodigoProducto: product.codigo,
									NombreProducto: product.nombre,
									Valor: product.precio,
									IdPedido: localStorage.getItem('orderId'),
									CedulaPedido: localStorage.getItem('orderCedula'),
									FechaPedido: localStorage.getItem('orderFecha'),
									Medida: product.medida,
									Color: product.color,
									Cantidad: product.cantidad,
									imagen: product.imgProduct,
									Estado: 'Sin Alistar',
									IdProducto: Math.random() * 1000000 + index,
								});
							}
						});

						productosPorEliminar.map((product) => {
							product.codigo = product.codigo.replace('/', '-');
							product.nombre = product.nombre.replace('/', '-');
							product.color = product.color.replace('/', '-');
							product.medida = product.medida.replace('/', '-');

							mutateDeleteProduct({
								id: product.IdPedido,
								cedula: product.CedulaPedido,
								fecha: product.FechaPedido,
								codigo: product.codigo,
								medida: product.medida,
								color: product.color,
								IdProducto: product.IdProducto,
							});
						});

						payments.map((payment, index) => {
							let pagoCrear = elementoPorActualizar(payment, pagosPorEliminar);

							if (
								(payment.medio === 'Droppi' ||
									payment.medio === 'DiliExpress' ||
									payment.medio === 'Paga en Tienda' ||
									payment.medio === 'Pendiente Pago') &&
								!pagoCrear
							) {
								let confirmado = true;
								if (
									payment.medio == 'Paga en Tienda' ||
									payment.medio === 'Pendiente Pago'
								)
									confirmado = false;
								mutatePayment({
									IdPedido: localStorage.getItem('orderId'),
									CedulaPedido: localStorage.getItem('orderCedula'),
									FechaPedido: localStorage.getItem('orderFecha'),
									Nombre: payment.tipoPago,
									Valor: payment.valor,
									Medio: payment.medio,
									imagen: payment.imagen,
									Confirmado: confirmado,
									IdPagos: Math.random() * 1000000 + index,
								});
							} else {
								if (!pagoCrear) {
									mutatePayment({
										IdPedido: localStorage.getItem('orderId'),
										CedulaPedido: localStorage.getItem('orderCedula'),
										FechaPedido: localStorage.getItem('orderFecha'),
										Nombre: payment.tipoPago,
										Valor: payment.valor,
										Medio: payment.medio,
										imagen: payment.imagen,
										IdPagos: Math.random() * 1000000 + index,
										Confirmado: false,
										FechaPago: payment.fecha,
									});
								}
							}
						});

						pagosPorEliminar.map((pagos) => {
							mutateDeletePayment({
								id: localStorage.getItem('orderId'),
								cedula: localStorage.getItem('orderCedula'),
								fecha: localStorage.getItem('orderFecha'),
								tipo: pagos.tipoPago,
								medio: pagos.medio,
								idPago: pagos.IdPagos,
							});
						});

						if (deliveryType != order[0]?.Tipo) {
							if (order[0]?.Tipo === 'Recogen')
								mutateDeleteInPoint({
									id: localStorage.getItem('orderId'),
									cedula: localStorage.getItem('orderCedula'),
									fecha: localStorage.getItem('orderFecha'),
								});
							if (order[0]?.Tipo === 'Despacho')
								mutateDeleteShipping({
									id: localStorage.getItem('orderId'),
									cedula: localStorage.getItem('orderCedula'),
									fecha: localStorage.getItem('orderFecha'),
								});
							if (order[0]?.Tipo === 'Domicilio')
								mutateDeleteDelivery({
									id: localStorage.getItem('orderId'),
									cedula: localStorage.getItem('orderCedula'),
									fecha: localStorage.getItem('orderFecha'),
								});

							if (deliveryType === 'Recogen')
								mutateInPoint({
									Id: localStorage.getItem('orderId'),
									Cedula: localStorage.getItem('orderCedula'),
									Fecha: localStorage.getItem('orderFecha'),
								});

							if (deliveryType === 'Despacho')
								mutateShipping({
									IdPedido: localStorage.getItem('orderId'),
									CedulaPedido: localStorage.getItem('orderCedula'),
									FechaPedido: localStorage.getItem('orderFecha'),
									Direccion: dataForm.direccion,
									Departamento: dataForm.department,
									Ciudad: dataForm.city,
								});
							if (deliveryType === 'Domicilio')
								mutateDelivery({
									IdPedido: localStorage.getItem('orderId'),
									CedulaPedido: localStorage.getItem('orderCedula'),
									FechaPedido: localStorage.getItem('orderFecha'),
									Direccion: dataForm.direccion,
									Departamento: dataForm.department,
									Ciudad: dataForm.city,
								});
						} else {
							console.log('primero sin errores');
							if (deliveryType === 'Despacho')
								mutateUpdateShipping({
									id: localStorage.getItem('orderId'),
									cedula: localStorage.getItem('orderCedula'),
									fecha: localStorage.getItem('orderFecha'),
									put: {
										Direccion: dataForm.direccion,
										Departamento: dataForm.department,
										Ciudad: dataForm.city,
									},
								});
							if (deliveryType === 'Domicilio')
								mutateUpdateDelivery({
									id: localStorage.getItem('orderId'),
									cedula: localStorage.getItem('orderCedula'),
									fecha: localStorage.getItem('orderFecha'),
									put: {
										Direccion: dataForm.direccion,
										Departamento: dataForm.department,
										Ciudad: dataForm.city,
									},
								});
						}

						mutateProcess({
							Tipo: 'Corregido',
							CedulaCliente: localStorage.getItem('orderCedula'),
							Fecha: localStorage.getItem('orderFecha'),
							Id: localStorage.getItem('orderId'),
							FechaProceso: dateNow(new Date()),
							Contexto:
								'El pedido fue corregido por ' +
								localStorage.getItem('nombre') +
								' #' +
								localStorage.getItem('id'),
						});

						pedidoActualizado();
					},
				}
			);
		}
	};

	return (
		<div className='FormOrder'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<p className='headlineSmall'>Tipo de pedido*</p>
					<select
						onClick={
							!cambiarPedido
								? (e) => ActualizarTipoPedido(setCambiarPedido)
								: ''
						}
						name='delivery'
						className='bodySmall select OP6'
						placeholder='Seleccionar envio'
						{...register('delivery', {
							onChange: (e) => handleChange(e),
							required: true,
							minLength: 5,
						})}
					>
						{selectOptions?.map((option) => (
							<option
								className='bodyMedium'
								key={option.value}
								value={option.value}
								selected={order ? option.value == order[0]?.Tipo : false}
							>
								{option.label}
							</option>
						))}
					</select>

					<span className='headlineSmall error'>
						{errors['delivery']?.type === 'required' && (
							<p>El tipo de envio es requerido</p>
						)}
					</span>
				</div>

				{deliveryType != 'Recogen' ? (
					<>
						<div className='FormOrder-MultipleInput'>
							<div>
								<p className='headlineSmall'>Departamento*</p>
								<select
									name='department'
									className='bodySmall select'
									onChange={departmentChange}
									{...register('department', {
										onChange: (e) => departmentChange(e),
										required: true,
										maxLength: 100,
										minLength: 1,
									})}
								>
									{deliveryType ? (
										deliveryType == 'Domicilio' ? (
											<>
												<option selected value='Valle del Cauca'>
													Valle del Cauca
												</option>
											</>
										) : (
											<>
												{data?.map((departamento, index) => (
													<>
														<option
															key={index + 1000}
															value={departamento.departamento}
															selected={
																order
																	? departamento.departamento ==
																	  order[0][order[0]?.Tipo]?.Departamento
																	: false
															}
														>
															{departamento.departamento}
														</option>
													</>
												))}
											</>
										)
									) : (
										<>
											{data?.map((departamento, index) => (
												<>
													<option
														key={index + 10000}
														value={departamento.departamento}
														selected={
															order
																? departamento.departamento ==
																  order[0][order[0]?.Tipo]?.Departamento
																: false
														}
													>
														{departamento.departamento}
													</option>
												</>
											))}
										</>
									)}
								</select>
								<span className='headlineSmall error'>
									{errors['department']?.type === 'required' && (
										<p>El departamento es requerido</p>
									)}
									{errors['department']?.type === 'maxLength' && (
										<p>El maximo de caracteres es 100</p>
									)}
									{errors['department']?.type === 'minLength' && (
										<p>El minimo de caracteres son 5</p>
									)}
								</span>
							</div>
							<div>
								<p className='headlineSmall'>Ciudad*</p>
								<select
									name='city'
									className='bodySmall select OP6'
									placeholder='Seleccionar envio'
									{...register('city', {
										required: true,
										maxLength: 100,
										minLength: 1,
									})}
								>
									{deliveryType ? (
										deliveryType == 'Domicilio' ? (
											domicilioDepartamento?.map((ciudad) => (
												<>
													<option
														selected={
															order
																? ciudad == order[0][order[0]?.Tipo]?.Ciudad
																: false
														}
														value={ciudad}
													>
														{ciudad}
													</option>
												</>
											))
										) : departament['ciudades'] ? (
											<>
												{departament['ciudades']?.map((ciudad) => (
													<option
														key={ciudad}
														selected={
															ciudad == order[0][order[0]?.Tipo]?.Ciudad
														}
														className='bodyMedium'
														value={ciudad}
													>
														{ciudad}
													</option>
												))}
											</>
										) : (
											<></>
										)
									) : departament['ciudades'] ? (
										<>
											{departament['ciudades']?.map((ciudad) => (
												<option
													selected={ciudad == order[0][order[0]?.Tipo]?.Ciudad}
													key={ciudad}
													className='bodyMedium'
													value={ciudad}
												>
													{ciudad}
												</option>
											))}
										</>
									) : (
										<></>
									)}
								</select>
								<span className='headlineSmall error'>
									{errors['city']?.type === 'required' && (
										<p>La ciudad es requerida</p>
									)}
									{errors['city']?.type === 'maxLength' && (
										<p>El maximo de caracteres es 100</p>
									)}
									{errors['city']?.type === 'minLength' && (
										<p>El minimo de caracteres son 5</p>
									)}
								</span>
							</div>
						</div>

						<FormInput
							register={register}
							errors={errors}
							required={true}
							nameLabel={'Dirección*'}
							nameInput={'Dirección'}
							name={'direccion'}
							errorMessage={'La dirección'}
							max={255}
							min={5}
							defaultValue={order[0][order[0]?.Tipo].Direccion}
						/>
						<FormInput
							register={register}
							errors={errors}
							required={true}
							type={'number'}
							nameLabel={'Costo de Envio*'}
							nameInput={'$0.0'}
							name={'envio'}
							errorMessage={'El costo del envio'}
							max={50}
							min={0}
							cambiarValorEnvio={setEnvio}
							value={envio}
						/>
					</>
				) : null}

				<ProductAdd
					products={products}
					setProducts={setProducts}
					envio={envio}
					envioPlus={envioPlus}
					editMode={true}
				/>
				<span className='headlineSmall'>
					<p style={{ color: 'red' }}>{errorProduct}</p>
				</span>
				<PaymentAdd
					payments={payments}
					envioPlus={setEnvioPlus}
					setPayments={setPayments}
					valorEnvio={envioPlus}
					tipoEnvio={deliveryType}
					editMode={true}
				/>
				<span className='headlineSmall' style={{ color: 'red' }}>
					{errorPayment?.map((error) => (
						<>
							{error} <br />
						</>
					))}
				</span>
				{envioPlus ? (
					<>
						<div className='headlineSmall  OP6 FormOrderDroppi'>
							<div>
								<p className='bodySmall'>El costo del envio es:</p>

								{new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
									minimumFractionDigits: 0,
								}).format(envio)}
							</div>
							<div>
								<p className='bodySmall'>La comision de dropi es:</p>

								{new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
									minimumFractionDigits: 0,
								}).format(envioPlus)}
							</div>
							<div>
								<p className='bodySmall'>El costo de los productos es:</p>

								{new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
									minimumFractionDigits: 0,
								}).format(calcularPrecioDropi())}
							</div>
							<div className='labelMedium'>
								<p>Total:</p>

								{new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
									minimumFractionDigits: 0,
								}).format(calcularEnvioDropi())}
							</div>
						</div>
						<div className='RememberDropi bodySmall'>
							Recuerda informarle al cliente que el valor a pagar al recibir el
							pedido es:{' '}
							<span className='labelSmall'>
								{new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
									minimumFractionDigits: 0,
								}).format(envioPlus + envioPlus / 0.05)}
							</span>
						</div>
					</>
				) : (
					<></>
				)}
				<button className='labelMedium' type='submit'>
					Enviar
				</button>
			</form>
		</div>
	);
};
