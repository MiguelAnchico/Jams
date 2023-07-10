import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutateUpdateShipping } from '../../app/hooks/Despachos';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { useMutateUpdateOrder } from '../../app/hooks/Pedidos';
import { useMutateProcess } from '../../app/hooks/Procesos';
import { FormInput } from '../FormOrder/FormInput/FormInput';

import close from '../../assets/images/close.png';

import './AddGuia.css';
import { AddReturnGuia } from './AddReturnGuia/AddReturnGuia';
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

const selectOptions = [
	'Servientrega',
	'Envia',
	'Coordinadora',
	'Interrapidisimo',
];

export const AddGuia = ({ order }) => {
	const [visible, setVisible] = useState(false);
	const { AgregarGuia, cancelar, errorDatos } = useNotificationsFeedback();
	const { administrador, logistica, cajero, contador, asesor } = Roles();

	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm();

	const {
		mutate: mutateShipping,
		isLoading: isLoadingShipping,
		error: errorShipping,
	} = useMutateUpdateShipping();

	const {
		mutate: mutateProcess,
		isLoading,
		errorUpdateProcess,
	} = useMutateProcess();

	const validarAccion = (data) => {
		AgregarGuia(onSubmit, data);
	};

	const eliminarGuia = () => {
		mutateShipping({
			id: order?.Id,
			cedula: order?.CedulaCliente,
			fecha: order?.Fecha,
			put: {
				Guia: 'Cancelado',
				GuiaRetorno: '',
				TransportadoraRetorno: '',
			},
		});
	};

	const onSubmit = (data) => {
		let comprobarEstado = false;
		order?.Procesos?.map((proceso) => {
			if (proceso?.Tipo == 'Entregado a transportadora')
				return (comprobarEstado = true);
		});

		if (comprobarEstado && order?.Despacho?.Guia != 'Cancelado')
			return errorDatos('El pedido ya cuenta con una guia');

		if (order?.Despacho?.Guia == 'Cancelado') {
			mutateShipping({
				id: order?.Id,
				cedula: order?.CedulaCliente,
				fecha: order?.Fecha,
				put: {
					Guia: data.nroGuia,
					Transportadora: data.transportadora,
					TransportadoraRetorno: null,
					GuiaRetorno: null,
				},
			});
		} else {
			mutateShipping({
				id: order?.Id,
				cedula: order?.CedulaCliente,
				fecha: order?.Fecha,
				put: {
					Guia: data.nroGuia,
					Transportadora: data.transportadora,
				},
			});
		}

		setVisible(false);
	};

	const comprobarRequisitoEstado = () => {
		let comprobado = true;
		order?.Procesos?.map((proceso) => {
			if (proceso?.Tipo === 'Empacado') return (comprobado = false);
		});

		return comprobado;
	};

	return (
		<div className='AddGuia'>
			<button
				onClick={(e) => setVisible(true)}
				className='AddGuiaButton button buttonLogistica labelSmall'
				disabled={
					(!comprobarRequisitoEstado() && !order?.Revision) || administrador
						? false
						: true
				}
			>
				Agregar Guia
			</button>
			<div
				className='ModalGuiaContainer'
				style={!visible ? { display: 'none' } : {}}
			>
				<img
					src={close}
					className='CloseModal'
					onClick={(e) => setVisible(false)}
				/>
				{order?.Despacho?.Guia && order?.Despacho?.Guia != 'Cancelado' ? (
					<AddReturnGuia order={order} setVisible={setVisible} />
				) : (
					<>
						<h2>Datos de transportadora de Envio</h2>
						<form onSubmit={handleSubmit(validarAccion)}>
							<div className='ContainerMultiple'>
								<div>
									<p className='headlineSmall selectTitle'>Transportadora*</p>
									<select
										name='transportadora'
										className='bodySmall select OP6'
										placeholder='Seleccionar transportadora'
										{...register('transportadora', {
											required: true,
											minLength: 5,
										})}
									>
										<option
											value='Seleccione una transportadora'
											selected
											hidden
											disabled
										>
											Seleccione una transportadora
										</option>
										{selectOptions?.map((value) => (
											<option className='bodyMedium' value={value}>
												{value}
											</option>
										))}
									</select>

									<span className='headlineSmall error'>
										{errors['transportadora']?.type === 'required' && (
											<p>La transportadora es requerida</p>
										)}
									</span>
								</div>
								<FormInput
									register={register}
									errors={errors}
									required={true}
									type={'text'}
									nameLabel={'Numero de Guia*'}
									nameInput={'Numero de Guia'}
									name={'nroGuia'}
									errorMessage={'El numero de guia'}
									max={25}
									min={3}
								/>
							</div>

							<button className='button labelSmall' type='submit'>
								Agregar
							</button>
						</form>
						{order?.Despacho?.GuiaRetorno ? (
							<button
								className='button buttonCancelado labelMedium'
								style={{ marginTop: '16px' }}
								onClick={(e) => cancelar(eliminarGuia, 'la guia de retorno')}
								disabled={!(!order?.Revision || administrador)}
							>
								Cancelar Guia de Retorno
							</button>
						) : (
							<></>
						)}
					</>
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
