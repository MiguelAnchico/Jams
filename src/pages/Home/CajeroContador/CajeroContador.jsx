import React from 'react';
import { CardSection } from '../../../components/CardSection/CardSection';

export const CajeroContador = ({ isLoading, organizateOrders }) => {
	const filtrarFacturado = () => {
		if (!organizateOrders) return [];
		let arrayFiltrado = [];

		organizateOrders()?.map((pedido) => {
			if (pedido?.Facturado) arrayFiltrado.push(pedido);
		});

		return arrayFiltrado;
	};

	const filtrarSinFacturado = () => {
		if (!organizateOrders) return [];
		let arrayFiltrado = [];

		organizateOrders()?.map((pedido) => {
			if (!pedido?.Facturado) arrayFiltrado.push(pedido);
		});

		return arrayFiltrado;
	};

	return (
		<div>
			<CardSection
				nombre='Sin Facturar'
				isLoading={isLoading}
				content={filtrarSinFacturado()}
				isContador={true}
			/>
			<CardSection
				nombre='Facturados'
				isLoading={isLoading}
				content={filtrarFacturado()}
				isContador={true}
			/>
		</div>
	);
};
