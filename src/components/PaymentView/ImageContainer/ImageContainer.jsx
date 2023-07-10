import { useState } from 'react';
import { urlimage } from '../../../app/api/Config';

export const ImageContainer = ({ pago }) => {
	const [image, setImage] = useState(false);

	return (
		<div className='ModalPaymentImage'>
			<img
				style={
					image
						? {
								height: '200%',
								top: '0',
								left: '0',
								zIndex: 110,
						  }
						: { width: '150px', objectFit: 'cover' }
				}
				src={urlimage + pago.Foto}
				onClick={(e) => setImage(!image)}
			/>
		</div>
	);
};
