import './Comentario.css';
import comentario from '../../assets/images/comentario.png';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import iconEnviar from '../../assets/images/enviar.png';
import { useMutateMessage } from '../../app/hooks/Message';
import { Mensaje } from './Mensaje/Mensaje';

import close from '../../assets/images/close.png';

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

export const Comentario = ({ order }) => {
	const [show, setShow] = useState(false);

	const {
		register,
		formState: { errors },
		resetField,
		handleSubmit,
		control,
	} = useForm();

	const {
		mutate: mutateMessage,
		error: createErrorMessage,
		isLoading: createLoadingMessage,
	} = useMutateMessage();

	const onSubmit = (data) => {
		mutateMessage(
			{
				IdPedido: order?.Id,
				CedulaPedido: order?.CedulaCliente,
				FechaPedido: order?.Fecha,
				IdMessage: Math.random() * 1000000,
				Contenido: data.message,
				Creador: localStorage.getItem('nombre'),
				IdCreador: localStorage.getItem('id'),
				FechaMensaje: dateNow(new Date()),
			},
			{
				onSuccess: () => {
					resetField('message');
				},
			}
		);
	};

	const resizeTextArea = (e) => {
		e.target.style.height = 0;
		if (e.target.scrollHeight < 100) {
			e.target.style.height = e.target.scrollHeight - 32 + 'px';
		} else {
			e.target.style.height = '100px';
		}
	};

	const organizateOrders = (e) => {
		return e?.sort(
			(a, b) =>
				-new Date(a.FechaMensaje).getTime() + new Date(b.FechaMensaje).getTime()
		);
	};

	return (
		<div className='Comentario'>
			<p className='bodySmall'>
				Numero de comentarios:{' '}
				<span className='labelSmall'>{order?.Messages?.length}</span>
			</p>
			<img
				onClick={(e) => setShow(true)}
				src={comentario}
				className='iconComentario'
			/>
			<div className='modal' style={!show ? { display: 'none' } : {}}>
				<div className='modal-container'>
					<img
						src={close}
						className='CloseModal'
						onClick={(e) => setShow(false)}
					/>
					<div className='modal-messages'>
						{organizateOrders(order?.Messages)?.map((mensaje) => (
							<Mensaje
								mensaje={mensaje.Contenido}
								creador={mensaje.Creador}
								fecha={mensaje.FechaMensaje}
								usuario={localStorage.getItem('nombre')}
							/>
						))}
					</div>
					<form className='modal-newMessage' onSubmit={handleSubmit(onSubmit)}>
						<textarea
							type='text'
							name='message'
							{...register('message', {
								required: true,
								minLength: 1,
							})}
							placeholder='Agrega un comentario'
							className='bodySmall OP6'
							onChange={resizeTextArea}
						/>
						<button className='buttonMessage'>
							<img className='iconEnviar' src={iconEnviar} />
						</button>
					</form>
				</div>
				<div onClick={(e) => setShow(false)} className='modal-background'></div>
			</div>
		</div>
	);
};
