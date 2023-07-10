import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutateUpdateShipping } from '../../../app/hooks/Despachos';
import { useNotificationsFeedback } from '../../../app/hooks/NotificationFeedback';
import { useMutateUpdateOrder } from '../../../app/hooks/Pedidos';
import { useMutateProcess } from '../../../app/hooks/Procesos';
import { FormInput } from '../../FormOrder/FormInput/FormInput';
import { Roles } from '../../../app/hooks/Role';

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

export const AddReturnGuia = ({ order, setVisible }) => {
	const { AgregarGuia, cancelar, errorDatos } = useNotificationsFeedback();
	const { administrador, logistica, cajero, contador, asesor } = Roles();

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
		AgregarGuia(onSubmitReturn, data);
	};

	const eliminarGuia = () => {
		mutateShipping({
			id: order?.Id,
			cedula: order?.CedulaCliente,
			fecha: order?.Fecha,
			put: {
				Guia: '',
				Transportadora: '',
			},
		});
	};

	const onSubmitReturn = (data) => {
		if (order?.Estado == 'En Retorno')
			return errorDatos('El pedido se encuentra en retorno');

		let comprobarEstado = true;
		order?.Procesos?.map((proceso) => {
			if (proceso?.Tipo == 'Distribucion') return (comprobarEstado = false);
		});

		if (comprobarEstado)
			return errorDatos(
				'El pedido no cuenta con un registro de que se haya entregado al cliente'
			);

		mutateShipping({
			id: order?.Id,
			cedula: order?.CedulaCliente,
			fecha: order?.Fecha,
			put: {
				Guia: 'Cancelado',
				GuiaRetorno: data.nroGuiaRetorno,
				TransportadoraRetorno: data.transportadoraRetorno,
			},
		});

		setVisible(false);
	};
	return (
		<>
			<h2>Datos de transportadora de Retorno</h2>
			<form onSubmit={handleSubmit(validarAccion)}>
				<div className='ContainerMultiple'>
					<div>
						<p className='headlineSmall selectTitle'>
							Transportadora de Retorno*
						</p>
						<select
							name='transportadora'
							className='bodySmall select OP6'
							placeholder='Seleccionar transportadora'
							{...register('transportadoraRetorno', {
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
								<p>La transportadora de retorno es requerida</p>
							)}
						</span>
					</div>
					<FormInput
						register={register}
						errors={errors}
						required={true}
						type={'text'}
						nameLabel={'Numero de Guia de Rertorno*'}
						nameInput={'Numero de Guia'}
						name={'nroGuiaRetorno'}
						errorMessage={'El numero de guia de retorno'}
						max={25}
						min={3}
					/>
				</div>

				<button className='button labelSmall' type='submit'>
					Agregar
				</button>
			</form>
			<button
				className='button buttonCancelado labelMedium'
				style={{ marginTop: '16px' }}
				onClick={(e) => cancelar(eliminarGuia, 'la guia de envio')}
				disabled={!(!order?.Revision || administrador)}
			>
				Cancelar Guia de envio
			</button>{' '}
			: <></>
		</>
	);
};
