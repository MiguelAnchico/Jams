import React from 'react';
import { useSearchOrder } from '../../app/hooks/Pedidos';
import { CardSection } from '../CardSection/CardSection';
import { SearchBar } from './SearchBar/SearchBar';

import './SectionSearch.css';

export const SectionSearch = () => {
	const {
		mutate,
		data: orders,
		error,
		isLoading,
		isFetching,
	} = useSearchOrder();

	const organizateOrders = () => {
		return orders?.sort(
			(a, b) => -new Date(a.Fecha).getTime() + new Date(b.Fecha).getTime()
		);
	};

	return (
		<div className='SectionSearch'>
			<div className='SearchElement'>
				<SearchBar getOrders={mutate} />
			</div>

			{orders ? (
				orders?.length != 0 ? (
					<CardSection
						nombre='Busquedas'
						isLoading={isLoading}
						content={organizateOrders(orders)}
						isContador={true}
					/>
				) : (
					<div className='bodyMedium searchAnswear'>
						No se ha encontrado ningun elemento
					</div>
				)
			) : (
				<></>
			)}
		</div>
	);
};
