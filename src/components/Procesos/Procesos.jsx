import { useState } from 'react';
import close from '../../assets/images/close.png';

import './Procesos.css';

export const Procesos = ({ procesos }) => {
	const [visible, setVisible] = useState(false);

	return (
		<div className='Procesos'>
			<button
				onClick={(e) => setVisible(true)}
				className='buttonProceso button labelSmall'
			>
				Procesos
			</button>
			<div
				className='ModalProcesosContainer'
				style={!visible ? { display: 'none' } : {}}
			>
				<img
					src={close}
					className='CloseModal'
					onClick={(e) => setVisible(false)}
				/>
				{procesos ? (
					procesos?.map((proceso, index) => (
						<div key={index}>
							<p className='NumeroProceso headlineSmall'>{index + 1}</p>
							<div className='ContenidoProceso'>
								<p className='bodySmall'>
									Tipo: <span className='headlineSmall'>{proceso.Tipo}</span>
								</p>
								<p className='bodySmall'>{proceso.Contexto}</p>
							</div>
						</div>
					))
				) : (
					<></>
				)}
			</div>
			<div
				onClick={(e) => setVisible(false)}
				className='Background'
				style={!visible ? { display: 'none' } : {}}
			></div>
		</div>
	);
};
