import { useOrder } from '../../app/hooks/Pedidos';
import { FormEditOrder } from '../../components/FormEditOrder/FormEditOrder';
import { FormEditProducts } from '../../components/FormEditProducts/FormEditProducts';
import { Header } from '../../components/Header/Header';
import { ReportError } from '../../components/ReportError/ReportError';
import { Spinner } from '../../components/Spinner/Spinner';

import './EditOrder.css';

export const EditOrder = () => {
	const {
		data: order,
		error: orderError,
		isLoading: isLoadingOrder,
	} = useOrder({
		id: localStorage.getItem('orderId'),
		cedula: localStorage.getItem('orderCedula'),
		fecha: localStorage.getItem('orderFecha'),
	}, 1);

	if (isLoadingOrder) return <Spinner />;

	return (
		<div className='EditOrder'>
			<Header isHome={false} url={'/order'} />
			<h1 className='SpaceHeader'>Editar Informacion del Cliente</h1>
			<ReportError procesos={order[0].Procesos} />
			<FormEditOrder order={order} />
			<h1 className=''>Editar Informacion del pedido</h1>
			<ReportError procesos={order[0].Procesos} />
			<FormEditProducts order={order} />
		</div>
	);
};
