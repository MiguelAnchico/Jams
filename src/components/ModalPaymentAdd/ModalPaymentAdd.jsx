import { useState } from 'react';

import { ModalInput } from '../ModalProductAdd/ModalInput/ModalInput';

import photoIcon from '../../assets/images/photo.png';
import cancelIcon from '../../assets/images/close.png';
import sinImagen from '../../assets/images/sin-imagen.jpg';

import './ModalPaymentAdd.css';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';

const tiposDePagoOptions = [
	{ value: 'Transferencia', label: 'Transferencia' },
	{ value: 'Consignacion', label: 'Consignacion' },
	{ value: 'Cartera', label: 'Cartera' },
	{ value: 'Wompi', label: 'Wompi' },
];

const mediosOptions = {
	Transferencia: ['Bancolombia', 'Nequi', 'Otros Bancos', 'Pendiente Pago'],
	Consignacion: ['Corresponsal', 'Pendiente Pago'],
	Cartera: {
		Recogen: [
			'Su+Pay',
			'Addi',
			'EsMio',
			'TuCuota',
			'Sistecredito',
			'Paga en Tienda',
		],
		Domicilio: [
			'Su+Pay',
			'Addi',
			'EsMio',
			'TuCuota',
			'Sistecredito',
			'DiliExpress',
		],
		Despacho: ['Su+Pay', 'Addi', 'EsMio', 'TuCuota', 'Sistecredito', 'Droppi'],
	},
	Wompi: ['Wompi', 'Pendiente Pago'],
};

const urlToObject = async () => {
	const response = await fetch(sinImagen);
	// here image is url/location of image
	const blob = await response.blob();
	const file = new File([blob], 'image.jpg', { type: blob.type });

	return file;
};

const evaluarFecha = (valor, errorDatos) => {
	const selectedDate = new Date(valor);
	const currentDate = new Date();

	if (selectedDate.getTime() > currentDate.getTime()) {
		errorDatos('La fecha de pago no puede ser mayor a la fecha actual');
		return false;
	}
	return true;
};

const validationInput = (e, enable, setError, setValue, errorDatos) => {
	const valor = e.target.value;
	const error = [];

	if (!valor && enable) error.push('Este campo es obligatorio');

	if (!evaluarFecha(valor, errorDatos)) {
		setValue('');
		setError(error);
		return;
	}

	setValue(valor);
	setError(error);
};

const validationSelect = (e, enable, defaultValue, setError, setValue) => {
	const valor = e.target.value;
	const error = [];

	if ((!valor && enable) || (valor == defaultValue && enable))
		error.push('Este campo es obligatorio');

	setValue(valor);
	setError(error);
};

export const ModalPaymentAdd = ({
	setPayments,
	payments,
	recalcular,
	envioPlus,
	tipoEnvio,
}) => {
	const [enable, setEnable] = useState(false);
	const { errorDatos, agregarElemento } = useNotificationsFeedback();

	const [imgPreviewPayment, setImgPreviewPayment] = useState('');
	const [imgPayment, setImgPayment] = useState('');
	const [imgName, setImgName] = useState('');

	const [tipoPago, setTipoPago] = useState('');
	const [medio, setMedio] = useState('');
	const [valor, setValor] = useState('');
	const [fecha, setFecha] = useState('');

	const [errorTipoPago, setErrorTipoPago] = useState([]);
	const [errorMedio, setErrorMedio] = useState([]);
	const [errorValor, setErrorValor] = useState([]);
	const [errorFecha, setErrorFecha] = useState([]);

	const handleChange = (e) => {
		setImgPreviewPayment(URL.createObjectURL(e.target.files[0]));
		setImgPayment(e.target.files[0]);
		setImgName(e.target.files[0].name);
	};

	const handleAdd = async (e) => {
		e.preventDefault();
		let imagen = imgPayment;
		let previewImage = imgPreviewPayment;
		let comprobarRepetido = false;
		let comprobarPagoTransportadora = false;
		let comisionDroppi = 0;

		if (
			errorTipoPago.length > 0 ||
			errorMedio.length > 0 ||
			errorValor.length > 0 ||
			errorFecha.length > 0 ||
			tipoPago == '' ||
			medio == '' ||
			valor == ''
		)
			return errorDatos('Debe de completar todos los campos');

		if (
			!(
				medio == 'Droppi' ||
				medio == 'DiliExpress' ||
				medio == 'Paga en Tienda' ||
				medio == 'Pendiente Pago'
			) &&
			fecha == ''
		)
			return errorDatos('Debe de completar el campo fecha');

		if (
			medio == 'Droppi' ||
			medio == 'DiliExpress' ||
			medio == 'Paga en Tienda' ||
			medio == 'Pendiente Pago'
		) {
			imagen = await urlToObject();
			previewImage = URL.createObjectURL(imagen);
		}

		if (!imagen) return errorDatos('Debe de subir una imagen del pago');
		let contador = 0;
		payments.map((payment) => {
			if (tipoPago === 'Cartera' && payment.medio === medio) contador++;
			if (contador > 1) comprobarRepetido = true;
		});

		if (
			medio === 'Droppi' ||
			medio === 'DiliExpress' ||
			medio === 'Paga en Tienda'
		) {
			payments.map((payment) => {
				if (
					payment.medio === 'Droppi' ||
					payment.medio === 'DiliExpress' ||
					payment.medio === 'Paga en Tienda'
				)
					comprobarPagoTransportadora = true;
			});
		}

		if (comprobarRepetido)
			return errorDatos(
				'Para la cartera no puede usar el mismo medio de pago mas de 2 veces'
			);

		if (comprobarPagoTransportadora)
			return errorDatos(
				'Solo puede tener un unico pago de una transportadora (Droppi, DiliExpress o Paga en tienda)'
			);

		if (medio === 'Droppi') comisionDroppi = valor * 0.05;

		let arrayPayments;

		arrayPayments = [
			...payments,
			{
				tipoPago,
				medio,
				valor,
				comisionDroppi,
				fecha,
				imagen,
				previewImage,
			},
		];

		if (medio == 'Droppi') envioPlus(valor * 0.05);
		setPayments(arrayPayments);
		recalcular(arrayPayments);
		agregarElemento();
		setTipoPago('');
		setMedio('');
		setValor('');
		setFecha('');
		setImgPayment('');
		setImgPreviewPayment('');
		setImgName('');
		setEnable(false);
	};

	return (
		<div className='ModalProductAdd'>
			<div className='Modal' style={enable ? {} : { display: 'none' }}>
				<div className='ModalContent'>
					<div className='ModalContentInput'>
						<img
							src={cancelIcon}
							onClick={(e) => setEnable(false)}
							className='IconClose'
						/>
						<h2>Agregar metodo de pago</h2>
						<p className='bodySmall'>
							Añade el comprobante, tipo, cantidad y fecha
						</p>

						<div>
							<div className='ModalContentUpload'>
								<img src={photoIcon} onClick={(e) => setEnable(false)} />
								<h3>ARRASTRA Y SUELTA</h3>
								<p className='bodyMedium'>la imagen del comprobante</p>
								<p className='bodySmall OP4'>
									Máximo de 50 MB. Formato JPG, PNG y JPNG
								</p>
								<input
									name='foto'
									onChange={handleChange}
									type='file'
									accept='.jpg, .jpeg, .png'
								/>
							</div>
							<div className='ModelContentPreview'>
								<img src={imgPreviewPayment} alt='' />
								<p className='bodySmall'>{imgName ? 'Cargado' : ''}</p>
							</div>
							<div className='FormOrder-TripleInput'>
								<div className='FormInput'>
									<label className='headlineSmall'>Tipo de pago*</label>
									<select
										className='bodySmall select OP6'
										placeholder='Seleccionar envio'
										onChange={(e) =>
											validationSelect(
												e,
												true,
												'Seleccione el metodo de pago',
												setErrorTipoPago,
												setTipoPago
											)
										}
										value={tipoPago}
									>
										<option
											className='bodyMedium'
											value='Seleccione el metodo de pago'
											selected
											hidden
										>
											Seleccione el tipo de pago
										</option>
										{tipoPago
											? tiposDePagoOptions?.map((option) => (
													<option
														className='bodyMedium'
														key={option.value}
														value={option.value}
													>
														{option.label}
													</option>
											  ))
											: tiposDePagoOptions?.map((option) => (
													<option
														key={option.value}
														className='bodyMedium'
														value={option.value}
													>
														{option.label}
													</option>
											  ))}
									</select>

									<span className='headlineSmall'>
										<p>
											{errorTipoPago?.map((err) => (
												<>
													{err} <br />
												</>
											))}
										</p>
									</span>
								</div>

								<div className='FormInput'>
									<label className='headlineSmall'>Medio*</label>
									<select
										className='bodySmall select OP6 select'
										placeholder='Seleccionar envio'
										onChange={(e) =>
											validationSelect(
												e,
												true,
												'Seleccione un medio',
												setErrorMedio,
												setMedio
											)
										}
										value={medio}
									>
										<option
											className='bodyMedium'
											value='Seleccione un medio'
											selected
											hidden
										>
											Seleccione un medio
										</option>
										{tipoPago ? (
											tipoEnvio ? (
												tipoPago == 'Cartera' ? (
													mediosOptions[tipoPago][tipoEnvio]?.map((option) => (
														<option className='bodyMedium' value={option}>
															{option}
														</option>
													))
												) : (
													mediosOptions[tipoPago]?.map((option) => (
														<option className='bodyMedium' value={option}>
															{option}
														</option>
													))
												)
											) : (
												<>
													<option
														className='bodyMedium'
														value='Primero seleccione el tipo de pedido'
													>
														Primero seleccione el tipo de envio
													</option>
												</>
											)
										) : (
											<>
												<option
													className='bodyMedium'
													value='Primero seleccione el tipo de pago'
												>
													Primero seleccione el tipo de pago
												</option>
											</>
										)}
									</select>

									<span className='headlineSmall'>
										<p>
											{errorTipoPago?.map((err) => (
												<>
													{err} <br />
												</>
											))}
										</p>
									</span>
								</div>
							</div>
							<div className='FormOrder-TripleInput fix-heigth'>
								<ModalInput
									label={'Valor*'}
									type={'number'}
									placeHolder={'Valor'}
									required={true}
									min={1000}
									max={5000000}
									setError={setErrorValor}
									error={errorValor}
									setValue={setValor}
									value={valor}
								/>
								{medio ? (
									medio == 'Droppi' ||
									medio == 'DiliExpress' ||
									medio == 'Paga en Tienda' ||
									medio == 'Pendiente Pago' ? (
										<></>
									) : (
										<div className='FormInput'>
											<label className='headlineSmall'>Fecha*</label>
											<input
												className='bodySmall select OP6 select'
												type='datetime-local'
												onChange={(e) =>
													validationInput(
														e,
														true,
														setErrorFecha,
														setFecha,
														errorDatos
													)
												}
												value={fecha}
											/>

											<span className='headlineSmall'>
												<p>
													{errorFecha?.map((err) => (
														<>
															{err} <br />
														</>
													))}
												</p>
											</span>
										</div>
									)
								) : (
									<div className='FormInput'>
										<label className='headlineSmall'>Fecha*</label>
										<input
											className='bodySmall select OP6 select'
											type='datetime-local'
											onChange={(e) =>
												validationInput(
													e,
													true,
													setErrorFecha,
													setFecha,
													errorDatos
												)
											}
											value={fecha}
										/>

										<span className='headlineSmall'>
											<p>
												{errorFecha?.map((err) => (
													<>
														{err} <br />
													</>
												))}
											</p>
										</span>
									</div>
								)}
							</div>
							<button className='labelMedium' onClick={handleAdd}>
								Agregar
							</button>
						</div>
					</div>
				</div>
				<div
					className='ModalBackground'
					onClick={(e) => setEnable(false)}
				></div>
			</div>
			<div onClick={(e) => setEnable(true)} className='BoxProductAdd'>
				+
			</div>
		</div>
	);
};
