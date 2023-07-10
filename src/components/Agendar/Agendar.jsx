import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutateUpdateDelivery } from '../../app/hooks/Domicilios';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { Roles } from '../../app/hooks/Role';

import close from '../../assets/images/close.png';
import { FormInput } from '../FormOrder/FormInput/FormInput';

import './Agendar.css';

const evaluarFecha = (valor, errorDatos) => {
	const selectedDate = new Date(valor);
	const currentDate = new Date();

	if (selectedDate.getTime() < currentDate.getTime()) {
		errorDatos('La fecha agendada no puede ser antes de la fecha actual');
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

export const Agendar = ({ order }) => {
	const [visible, setVisible] = useState(false);
	const { administrador, logistica, cajero, contador, asesor } = Roles();

	const [fechaInicio, setFechaInicio] = useState('');
	const [fechaFinal, setFechaFinal] = useState('');
	const [errorFechaInicio, setErrorFechaInicio] = useState([]);
	const [errorFechaFinal, setErrorFechaFinal] = useState([]);

	const { notificarAgendado, errorDatos } = useNotificationsFeedback();

	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm();

	const validarAccion = () => {
		if (!fechaInicio) return errorDatos('La franja inicial es obligatoria');
		if (!fechaFinal) return errorDatos('La franja final es obligatoria');
		notificarAgendado(onSubmit, 'agregar el');
	};

	const eliminarAccion = () => {
		notificarAgendado(onSubmit, 'eliminar el');
	};

	const {
		mutate: mutateUpdateDelivery,
		error: updateErrorDelivery,
		isLoading: updateLoadingDelivery,
	} = useMutateUpdateDelivery();

	const comprobarRequisitoEstado = () => {
		let comprobado = true;
		order?.Procesos?.map((proceso) => {
			if (proceso?.Tipo === 'Empacado') return (comprobado = false);
		});

		return comprobado;
	};
	const onSubmit = (data) => {
		if (data == 'agregar el') {
			mutateUpdateDelivery({
				id: localStorage.getItem('orderId'),
				cedula: localStorage.getItem('orderCedula'),
				fecha: localStorage.getItem('orderFecha'),
				put: {
					Agendado: 1,
					FechaAgendadoInicio: fechaInicio,
					FechaAgendadoFinal: fechaFinal,
				},
			});
		} else {
			mutateUpdateDelivery({
				id: localStorage.getItem('orderId'),
				cedula: localStorage.getItem('orderCedula'),
				fecha: localStorage.getItem('orderFecha'),
				put: {
					Agendado: 0,
					FechaAgendadoInicio: null,
					FechaAgendadoFinal: null,
				},
			});
		}
	};

	return (
		<div className='Agendar'>
			<button
				onClick={(e) => setVisible(true)}
				className='AddGuiaButton button buttonLogistica labelSmall'
				disabled={
					(!comprobarRequisitoEstado() && !order?.Revision) || administrador
						? false
						: true
				}
			>
				Agendar
			</button>
			<div className='ModalAgendar' style={!visible ? { display: 'none' } : {}}>
				<img
					src={close}
					className='CloseModal'
					onClick={(e) => setVisible(false)}
				/>
				<form onSubmit={handleSubmit(validarAccion)}>
					<div className='FormInput'>
						<label className='headlineSmall'>Franja Inicial*</label>
						<input
							className='bodySmall select OP6 select'
							type='datetime-local'
							onChange={(e) =>
								validationInput(
									e,
									true,
									setErrorFechaInicio,
									setFechaInicio,
									errorDatos
								)
							}
							value={fechaInicio}
						/>

						<span className='headlineSmall'>
							<p>
								{errorFechaInicio?.map((err) => (
									<>
										{err} <br />
									</>
								))}
							</p>
						</span>
					</div>
					<div className='FormInput'>
						<label className='headlineSmall'>Franja Final*</label>
						<input
							className='bodySmall select OP6 select'
							type='datetime-local'
							onChange={(e) =>
								validationInput(
									e,
									true,
									setErrorFechaFinal,
									setFechaFinal,
									errorDatos
								)
							}
							value={fechaFinal}
						/>

						<span className='headlineSmall'>
							<p>
								{errorFechaFinal?.map((err) => (
									<>
										{err} <br />
									</>
								))}
							</p>
						</span>
					</div>
					<button className='button labelSmall'>Agendar Pedido</button>
				</form>
				{order.Domicilio.Agendado ? (
					<button
						className='button labelSmall buttonCancelado'
						onClick={eliminarAccion}
					>
						Eliminar agendado
					</button>
				) : (
					<></>
				)}
			</div>
			<div
				onClick={(e) => setVisible(false)}
				className='Background'
				style={!visible ? { display: 'none' } : {}}
			></div>
		</div>
	);
};
