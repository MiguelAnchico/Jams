import { useEffect } from 'react';
import './FormInput.css';

export const FormInput = ({
	register,
	errors,
	nameLabel,
	nameInput,
	name,
	max,
	min,
	type,
	required,
	errorMessage,
	cambiarValorEnvio,
	value,
	defaultValue,
}) => {
	useEffect(() => {}, []);

	return (
		<div className='FormInput'>
			<label className='headlineSmall' htmlFor={name}>
				{nameLabel}
			</label>
			<input
				type={type}
				name={name}
				{...register(name, {
					required: required,
					maxLength: max,
					minLength: min,
				})}
				value={value}
				defaultValue={defaultValue}
				onChange={(e) =>
					cambiarValorEnvio ? cambiarValorEnvio(e.target.value) : ''
				}
				placeholder={nameInput}
				className='bodySmall OP6'
			/>
			<span className='headlineSmall'>
				{errors[name]?.type === 'required' && (
					<p>{errorMessage} es requerido</p>
				)}
				{errors[name]?.type === 'maxLength' && (
					<p>El maximo de caracteres es {max}</p>
				)}
				{errors[name]?.type === 'minLength' && (
					<p>El minimo de caracteres son {min}</p>
				)}
			</span>
		</div>
	);
};
