import { useForm } from 'react-hook-form';
import { FormInput } from '../FormOrder/FormInput/FormInput';

import '../FormOrder/FormOrder.css';
import { useMutateUpdateOrder, useOrder } from '../../app/hooks/Pedidos';
import {
	useMutateShipping,
	useMutateUpdateShipping,
} from '../../app/hooks/Despachos';
import {
	useMutateDelivery,
	useMutateUpdateDelivery,
} from '../../app/hooks/Domicilios';
import { useMutateInPoint } from '../../app/hooks/Recogen';
import { useMutateProcess } from '../../app/hooks/Procesos';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { Spinner } from '../Spinner/Spinner';

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

export const FormEditOrder = ({ order }) => {
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
		error: createErrorShipping,
		isLoading: createLoadingShipping,
	} = useMutateUpdateShipping();

	const {
		mutate: mutateDelivery,
		error: createErrorDelivery,
		isLoading: createLoadingDelivery,
	} = useMutateUpdateDelivery();

	const {
		mutate: mutateProcess,
		error: createErrorProcess,
		isLoading: createLoadingProcess,
	} = useMutateProcess();

	const { cambioExitoso } = useNotificationsFeedback();

	const onSubmit = (dataForm) => {
		dataForm.nombre = dataForm.nombre.replace('/', '-');
		dataForm.observaciones = dataForm?.observaciones?.replace('/', '-');
		dataForm.direccion = dataForm?.direccion?.replace('/', '-');
		mutateOrder(
			{
				id: localStorage.getItem('orderId'),
				cedula: localStorage.getItem('orderCedula'),
				fecha: localStorage.getItem('orderFecha'),
				put: {
					Whatsapp: dataForm.whatsapp,
					NombreCliente: dataForm.nombre,
					CedulaCliente: dataForm.cedula,
					Correo: dataForm.correo,
					Corregir: 0,
					Observaciones: dataForm.observaciones,
				},
			},
			{
				onSuccess: (data) => {
					localStorage.setItem('orderCedula', dataForm.cedula);
					if (order[0].Tipo === 'Despacho')
						mutateShipping({
							id: localStorage.getItem('orderId'),
							cedula: localStorage.getItem('orderCedula'),
							fecha: localStorage.getItem('orderFecha'),
							put: {
								Direccion: dataForm.direccion,
							},
						});
					if (order[0].Tipo === 'Domicilio')
						mutateDelivery({
							id: localStorage.getItem('orderId'),
							cedula: localStorage.getItem('orderCedula'),
							fecha: localStorage.getItem('orderFecha'),
							put: {
								Direccion: dataForm.direccion,
							},
						});

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

					cambioExitoso();
				},
			}
		);
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
						defaultValue={order[0]?.NombreCliente}
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
						defaultValue={order[0]?.CedulaCliente}
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
						defaultValue={order[0]?.Whatsapp}
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
						defaultValue={order[0]?.Correo}
					/>
				</div>
				{order[0]?.Tipo != 'Recogen' ? (
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
						defaultValue={order[0]?.Observaciones}
					/>
					<span className='headlineSmall'>
						{errors['observaciones']?.type === 'maxLength' && (
							<p>El maximo de caracteres es 500</p>
						)}
					</span>
				</div>
				<button className='labelMedium' type='submit'>
					Actualizar
				</button>
			</form>
		</div>
	);
};
