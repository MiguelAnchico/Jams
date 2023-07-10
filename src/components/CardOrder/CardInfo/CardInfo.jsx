import './CardInfo.css';

export const CardInfo = ({ name, id, whatsapp }) => {
	return (
		<div className='CardInfo'>
			<div>
				<p className='title bodySmall'>Nombre</p>
				<p className='description headlineSmall'>{name}</p>
			</div>
			<div>
				<p className='title bodySmall'>Cedula</p>
				<p className='description headlineSmall'>{id}</p>
			</div>
			<div>
				<p className='title bodySmall'>Whatsapp</p>
				<p className='description headlineSmall'>{whatsapp}</p>
			</div>
		</div>
	);
};
