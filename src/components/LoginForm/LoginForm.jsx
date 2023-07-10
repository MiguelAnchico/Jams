import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';

import './LoginForm.css';
import arrowLeft from '../../assets/images/left-arrow.png';
import eye from '../../assets/images/vista.png';
import eyeclose from '../../assets/images/eye.png';

import { login } from '../../app/api/Login';
import { Spinner } from '../Spinner/Spinner';

export const LoginForm = ({ setRole, role }) => {
	const [user, setUser] = useState('');
	const [password, setPassword] = useState('');
	const [passwordShown, setPasswordShown] = useState(false);

	const togglePasswordVisiblity = () => {
		setPasswordShown(passwordShown ? false : true);
	};

	const navigate = useNavigate();

	const { mutate, error, isLoading } = useMutation(login);

	const handleSubmit = async (e) => {
		e.preventDefault();

		mutate(
			{ Nombre: user, Pwd: password, Tipo: role },
			{
				onSuccess: (data) => {
					localStorage.setItem('role', data.user.Tipo);
					localStorage.setItem('nombre', data.user.Nombre);
					localStorage.setItem('id', data.user.Id);
					navigate('/home');
				},
			}
		);
	};

	return (
		<div className='LoginForm'>
			<h1>Iniciar Sesión</h1>
			<p className='bodySmall'>
				como <span style={{ fontWeight: 'bold' }}>{role}</span>
			</p>
			{isLoading ? (
				<Spinner />
			) : (
				<form className='LoginForm_Field' onSubmit={(e) => handleSubmit(e)}>
					<input
						type='text'
						placeholder='Nombre'
						onChange={(e) => setUser(e.target.value)}
						className='bodySmall'
						autocomplete
					></input>
					<div className='passwordField'>
						<input
							type={passwordShown ? 'text' : 'password'}
							placeholder='Contraseña'
							onChange={(e) => setPassword(e.target.value)}
							className='bodySmall'
							autocomplete
						></input>
						<img
							className='imgeye'
							src={passwordShown ? eyeclose : eye}
							onClick={togglePasswordVisiblity}
						></img>
					</div>

					<button className='button labelSmall'>Iniciar</button>
				</form>
			)}

			<a
				href='https://api.whatsapp.com/send?phone=573103545826'
				target='_blank'
				className='labelMedium OP6'
			>
				¿Olvidaste tu contraseña?
			</a>
			<div className='LoginBack OP4 headlineSmall'>
				<img src={arrowLeft} />
				<p onClick={() => setRole(null)}>Atras</p>
			</div>
		</div>
	);
};

LoginForm.propTypes = {
	setRole: PropTypes.func.isRequired,
	role: PropTypes.string.isRequired,
};
