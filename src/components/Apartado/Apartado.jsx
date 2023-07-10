import { useEffect, useState } from 'react';
import './Apartado.css';
import { FormInput } from '../FormOrder/FormInput/FormInput';
import { useForm } from 'react-hook-form';
import { useMutateProcess } from '../../app/hooks/Procesos';
import { useMutateUpdateOrder } from '../../app/hooks/Pedidos';

import close from '../../assets/images/close.png';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';

export const Apartado = ({ order, setFactura }) => {
	const [show, setShow] = useState(false);

	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm();

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

	const { notificarAparcado } = useNotificationsFeedback();

	const validarAccion = (data) => {
		notificarAparcado(agregarAccion, data);
	};

	const agregarAccion = (data) => {
		mutateOrder({
			id: order?.Id,
			cedula: order?.CedulaCliente,
			fecha: order?.Fecha,
			put: {
				Apartado: 1,
				nroApartado: data.nroFactura,
			},
		});
	};

	useEffect(() => {
		setFactura(show);
	}, [show]);

	const eliminarAccion = () => {
		mutateOrder({
			id: order?.Id,
			cedula: order?.CedulaCliente,
			fecha: order?.Fecha,
			put: {
				Apartado: 0,
				nroApartado: null,
			},
		});
	};

	return (
		<div className='Apartado'>
			<div>
				<div className='ModalApartado' style={!show ? { display: 'none' } : {}}>
					<img
						src={close}
						className='CloseModal'
						onClick={(e) => setShow(false)}
					/>
					<form onSubmit={handleSubmit(validarAccion)}>
						<FormInput
							register={register}
							errors={errors}
							required={true}
							type={'text'}
							nameLabel={'Numero de factura*'}
							nameInput={'Numero de factura'}
							name={'nroFactura'}
							errorMessage={'El numero de factura'}
							max={25}
							min={5}
						/>
						<button className='button labelSmall'>Facturar Apartado</button>
					</form>
					{order.Apartado ? (
						<button
							className='button labelSmall buttonCancelado'
							onClick={(e) => eliminarAccion()}
						>
							Eliminar Apartado
						</button>
					) : (
						<></>
					)}
				</div>
			</div>
			<button
				className='button buttonRegresando labelSmall'
				onClick={(e) => setShow(true)}
			>
				Apartar Pedido
			</button>
		</div>
	);
};
