export const Bloqueador = ({ array, llave, valueElement }) => {
	return (
		<div
			className='Bloqueado'
			style={
				array?.find((element) => element[llave] == valueElement)
					? { display: 'none' }
					: {}
			}
		></div>
	);
};
