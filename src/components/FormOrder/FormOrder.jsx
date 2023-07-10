import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { ProductAdd } from '../../components/ProductAdd/ProductAdd';
import { FormInput } from './FormInput/FormInput';

import { getDepartments } from '../../app/api/Departamentos';

import './FormOrder.css';
import { PaymentAdd } from '../PaymentAdd/PaymentAdd';
import { useMutateOrder } from '../../app/hooks/Pedidos';
import { useMutateProduct } from '../../app/hooks/Productos';
import { useMutatePayment } from '../../app/hooks/Pagos';
import { useMutateShipping } from '../../app/hooks/Despachos';
import { useMutateDelivery } from '../../app/hooks/Domicilios';
import { useMutateInPoint } from '../../app/hooks/Recogen';
import { useMutateProcess } from '../../app/hooks/Procesos';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';

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

export const FormOrder = () => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm();

	const {
		mutate: mutateOrder,
		error: createErrorOrder,
		isLoading: createLoadingOrder,
	} = useMutateOrder();

	const {
		mutate: mutateProduct,
		error: createErrorProduct,
		isLoading: createLoadingProduct,
	} = useMutateProduct();

	const {
		mutate: mutatePayment,
		error: createErrorPayment,
		isLoading: createLoadingPayment,
	} = useMutatePayment();

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
		mutate: mutateProcess,
		error: createErrorProcess,
		isLoading: createLoadingProcess,
	} = useMutateProcess();

	const { data, error, isLoading } = useQuery(['departments'], getDepartments);
	const { agregarElemento, MostrarPedido } = useNotificationsFeedback();

	const [products, setProducts] = useState([]);
	const [payments, setPayments] = useState([]);
	const [departament, setDepartament] = useState([]);
	const [deliveryType, setDeliveryType] = useState('');
	const [envio, setEnvio] = useState(0);
	const [envioPlus, setEnvioPlus] = useState(undefined);

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

	useEffect(() => {
		if (deliveryType) {
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
		const valorEnvio = deliveryType !== 'Recogen' ? dataForm.envio : 0;
		let envioDroppi = null;

		if (validationPrice(valorEnvio)) {
			let totalPayments = 0;
			setErrorPayment([]);

			payments?.map((payment) => {
				totalPayments += parseFloat(payment.valor);
			});

			if (envioPlus) envioDroppi = envioPlus;

			dataForm.nombre = dataForm.nombre.replaceAll('/', '-');
			dataForm.observaciones = dataForm?.observaciones?.replaceAll('/', '-');

			mutateOrder(
				{
					NombreCliente: dataForm.nombre,
					CedulaCliente: dataForm.cedula,
					Fecha: dateNow(new Date()),
					Whatsapp: dataForm.whatsapp,
					Correo: dataForm.correo,
					Categoria: 'Sin Alistar',
					Observaciones: dataForm.observaciones,
					CostoEnvio: valorEnvio,
					ComicionDroppi: envioDroppi,
					Revision: 0,
					Facturado: false,
					NumeroFactura: '',
					Estado: 'Creado',
					IdCreador: localStorage.getItem('id'),
					Creador: localStorage.getItem('nombre'),
					Tipo: deliveryType,
					Corregir: 0,
				},
				{
					onSuccess: (data) => {
						products.map((product, index) => {
							product.codigo = product.codigo.replaceAll('/', '-');
							product.nombre = product.nombre.replaceAll('/', '-');
							product.color = product.color.replaceAll('/', '-');
							product.medida = product.medida.replaceAll('/', '-');

							mutateProduct({
								CodigoProducto: product.codigo,
								NombreProducto: product.nombre,
								Valor: product.precio,
								IdPedido: data.Id,
								CedulaPedido: data.CedulaCliente,
								FechaPedido: data.Fecha,
								Medida: product.medida,
								Color: product.color,
								Cantidad: product.cantidad,
								imagen: product.imgProduct,
								Estado: 'Sin Alistar',
								IdProducto: Math.random() * 1000000 + index,
							});
						});

						payments.map((payment, index) => {
							if (
								payment.medio === 'Droppi' ||
								payment.medio === 'DiliExpress' ||
								payment.medio === 'Paga en Tienda' ||
								payment.medio === 'Pendiente Pago'
							) {
								let confirmado = true;
								if (
									payment.medio == 'Paga en Tienda' ||
									payment.medio === 'Pendiente Pago'
								)
									confirmado = false;
								mutatePayment({
									IdPedido: data.Id,
									CedulaPedido: data.CedulaCliente,
									FechaPedido: data.Fecha,
									Nombre: payment.tipoPago,
									Valor: payment.valor,
									Medio: payment.medio,
									imagen: payment.imagen,
									IdPagos: Math.random() * 1000000 + index,
									Confirmado: confirmado,
								});
							} else {
								mutatePayment({
									IdPedido: data.Id,
									CedulaPedido: data.CedulaCliente,
									FechaPedido: data.Fecha,
									Nombre: payment.tipoPago,
									Valor: payment.valor,
									Medio: payment.medio,
									imagen: payment.imagen,
									IdPagos: Math.random() * 1000000 + index,
									Confirmado: false,
									FechaPago: payment.fecha,
								});
							}
						});

						if (deliveryType === 'Recogen')
							mutateInPoint({
								Id: data.Id,
								Cedula: data.CedulaCliente,
								Fecha: data.Fecha,
							});
						dataForm.direccion = dataForm?.direccion?.replaceAll('/', '-');

						if (deliveryType === 'Despacho')
							mutateShipping({
								IdPedido: data.Id,
								CedulaPedido: data.CedulaCliente,
								FechaPedido: data.Fecha,
								Direccion: dataForm.direccion,
								Departamento: dataForm.department,
								Ciudad: dataForm.city,
							});
						if (deliveryType === 'Domicilio')
							mutateDelivery({
								IdPedido: data.Id,
								CedulaPedido: data.CedulaCliente,
								FechaPedido: data.Fecha,
								Direccion: dataForm.direccion,
								Departamento: dataForm.department,
								Ciudad: dataForm.city,
							});

						mutateProcess({
							Tipo: 'Creación',
							CedulaCliente: data.CedulaCliente,
							Fecha: data.Fecha,
							Id: data.Id,
							FechaProceso: data.Fecha,
							Contexto:
								'El pedido fue creado por ' +
								localStorage.getItem('nombre') +
								' #' +
								localStorage.getItem('id'),
						});

						MostrarPedido(data.Id);
					},
				}
			);
		}
	};

	return (
		<div className='FormOrder'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='FormOrder-MultipleInput'>
					<FormInput
						register={register}
						errors={errors}
						required={true}
						type={'text'}
						nameLabel={'Nombre Completo*'}
						nameInput={'Nombre'}
						name={'nombre'}
						errorMessage={'El nombre'}
						max={50}
						min={6}
					/>
					<FormInput
						register={register}
						errors={errors}
						required={true}
						type={'number'}
						nameLabel={'Cedula*'}
						nameInput={'Cedula'}
						name={'cedula'}
						errorMessage={'La cedula'}
						max={15}
						min={5}
					/>
				</div>
				<div className='FormOrder-MultipleInput'>
					<FormInput
						register={register}
						errors={errors}
						required={true}
						type={'number'}
						nameLabel={'Whatsapp*'}
						nameInput={'Numero'}
						errorMessage={'El whatsapp'}
						name={'whatsapp'}
						max={20}
						min={10}
					/>
					<FormInput
						register={register}
						errors={errors}
						required={false}
						type={'email'}
						nameLabel={'Correo (Opcional)'}
						nameInput={'Correo'}
						errorMessage={'El correo'}
						name={'correo'}
						max={50}
						min={5}
					/>
				</div>

				<div>
					<p className='headlineSmall'>Tipo de pedido*</p>
					<select
						name='delivery'
						className='bodySmall select OP6'
						placeholder='Seleccionar envio'
						{...register('delivery', {
							onChange: (e) => handleChange(e),
							required: true,
							minLength: 5,
						})}
					>
						<option
							value='Seleccione un tipo de pedido'
							selected
							hidden
							disabled
						>
							Seleccione un tipo de pedido
						</option>
						{selectOptions?.map((option) => (
							<option
								className='bodyMedium'
								key={option.value}
								value={option.value}
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
												<option
													value='Seleccione un departamento'
													selected
													hidden
													disabled
												>
													Seleccione un departamento
												</option>
												<option value='Valle del Cauca'>Valle del Cauca</option>
											</>
										) : (
											<>
												{data?.map((departamento, index) => (
													<>
														<option
															value='Seleccione un departamento'
															selected
															hidden
															disabled
														>
															Seleccione un departamento
														</option>
														<option
															key={index + 1000}
															value={departamento.departamento}
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
														value='Seleccione un departamento'
														selected
														hidden
														disabled
													>
														Seleccione un departamento
													</option>
													<option
														key={index + 10000}
														value={departamento.departamento}
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
														key={ciudad}
														value='Seleccione una ciudad'
														selected
														hidden
														disabled
													>
														Seleccione una ciudad
													</option>

													<option value={ciudad}>{ciudad}</option>
												</>
											))
										) : departament['ciudades'] ? (
											<>
												<option value='' disabled selected hidden>
													Seleccione una ciudad
												</option>
												{departament['ciudades']?.map((ciudad) => (
													<option
														key={ciudad}
														className='bodyMedium'
														value={ciudad}
													>
														{ciudad}
													</option>
												))}
											</>
										) : (
											<option disabled selected hidden className='bodyMedium'>
												Primero seleccione un departamento
											</option>
										)
									) : departament['ciudades'] ? (
										<>
											<option value='' disabled selected hidden>
												Seleccione una ciudad
											</option>
											{departament['ciudades']?.map((ciudad) => (
												<option
													key={ciudad}
													className='bodyMedium'
													value={ciudad}
												>
													{ciudad}
												</option>
											))}
										</>
									) : (
										<option disabled selected hidden className='bodyMedium'>
											Primero seleccione un departamento
										</option>
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
				<div className='FormInput'>
					<label className='headlineSmall'>Observaciones</label>
					<input
						type={'text'}
						name={'observaciones'}
						{...register('observaciones', {
							required: false,
							maxLength: 500,
						})}
						placeholder={
							'Agregue especificaciones, procedimientos o consideraciones en este apartado'
						}
						className='bodySmall OP6'
					/>
					<span className='headlineSmall'>
						{errors['observaciones']?.type === 'maxLength' && (
							<p>El maximo de caracteres es 500</p>
						)}
					</span>
				</div>
				<button
					disabled={
						createLoadingOrder ||
						createLoadingProduct ||
						createLoadingPayment ||
						createLoadingShipping ||
						createLoadingDelivery ||
						createLoadingInPoint ||
						createLoadingProcess
					}
					className='labelMedium'
					type='submit'
				>
					Enviar
				</button>
			</form>
		</div>
	);
};
