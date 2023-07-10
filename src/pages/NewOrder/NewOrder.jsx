import { FormOrder } from '../../components/FormOrder/FormOrder';
import { Header } from '../../components/Header/Header';

import './NewOrder.css';

export const NewOrder = () => {
	return (
		<div className='NewOrder'>
			<Header isHome={false} url={'/home'} />
			<h1 className='SpaceHeader'>Crear Nuevo Pedido</h1>
			<FormOrder />
		</div>
	);
};
