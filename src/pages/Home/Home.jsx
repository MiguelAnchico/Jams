import { useNavigate } from 'react-router-dom';

import { Header } from '../../components/Header/Header';

import './Home.css';
import { ResumeWallet } from '../../components/ResumeWallet/ResumeWallet';
import { useOrders } from '../../app/hooks/Pedidos';
import { Logistica } from './Logistica/Logistica';
import { Asesor } from './Asesor/Asesor';
import { CajeroContador } from './CajeroContador/CajeroContador';
import { Administrador } from './Administrador/Administrador';

import { Roles } from '../../app/hooks/Role';
import { SectionSearch } from '../../components/SectionSearch/SectionSearch';

export const Home = () => {
	const navigate = useNavigate();

	const { data: orders, error, isLoading, isFetching } = useOrders();

	const organizateOrders = () => {
		return orders?.sort(
			(a, b) => -new Date(a.Fecha).getTime() + new Date(b.Fecha).getTime()
		);
	};

	const { administrador, logistica, cajero, contador, asesor } = Roles();

	if (administrador)
		return (
			<div className='Home'>
				<Header isHome={true} />
				<div className='Content SpaceHeader'>
					<a
						className='NewOrder labelSmall'
						onClick={() => navigate('/new-order')}
					>
						+ Crear pedido
					</a>
					<SectionSearch />
					<Administrador
						isLoading={isLoading}
						organizateOrders={organizateOrders}
					/>
				</div>
				<ResumeWallet />
			</div>
		);

	if (cajero || contador)
		return (
			<div className='Home'>
				<Header isHome={true} />
				<div className='Content SpaceHeader'>
					<SectionSearch />
					<CajeroContador
						isLoading={isLoading}
						organizateOrders={organizateOrders}
					/>
				</div>
				<ResumeWallet />
			</div>
		);

	if (asesor)
		return (
			<div className='Home'>
				<Header isHome={true} />
				<div className='Content SpaceHeader'>
					<SectionSearch />
					<a
						className='NewOrder labelSmall'
						onClick={() => navigate('/new-order')}
					>
						+ Crear pedido
					</a>
					<Asesor isLoading={isLoading} organizateOrders={organizateOrders} />
				</div>
			</div>
		);

	if (logistica)
		return (
			<div className='Home'>
				<Header isHome={true} />
				<div className='Content SpaceHeader'>
					<SectionSearch />
					<Logistica
						isLoading={isLoading}
						organizateOrders={organizateOrders}
					/>
				</div>
			</div>
		);
};
