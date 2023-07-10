const validationInput = (e, enable, type, min, max, setError, setValue) => {
	const valor = e.target.value;
	const error = [];

	if (!valor && enable) error.push('Este campo es obligatorio');
	if (type == 'text') {
		if (valor.length < min) error.push('El minimo de caracteres es ' + min);
		if (valor.length > max) error.push('El maximo de caracteres es ' + max);
	}
	if (type == 'number') {
		if (valor < min) error.push('Debe ser un numero mayor a ' + min);
		if (valor > max) error.push('Debe ser un numero inferior a ' + max);
	}

	setValue(valor);
	setError(error);
};

export const ModalInput = ({
	label,
	type,
	placeHolder,
	required,
	min,
	max,
	setError,
	error,
	setValue,
	value,
}) => {
	return (
		<div className='FormInput'>
			<label className='headlineSmall'>{label}</label>
			<input
				type={type}
				placeholder={placeHolder}
				className='bodySmall OP6'
				onChange={(e) =>
					validationInput(e, required, type, min, max, setError, setValue)
				}
				value={value}
			/>
			<span className='headlineSmall'>
				<p>
					{error?.map((err) => (
						<>
							{err} <br />
						</>
					))}
				</p>
			</span>
		</div>
	);
};
