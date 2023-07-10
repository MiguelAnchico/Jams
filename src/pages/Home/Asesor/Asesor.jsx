import React from 'react';
import { CardSection } from '../../../components/CardSection/CardSection';

export const Asesor = ({ isLoading, organizateOrders }) => {
	const filtrarPendientesCorrecion = () => {
		if (!organizateOrders) return [];
		let arrayFiltrado = [];

		organizateOrders()?.map((pedido) => {
			if (
				pedido?.Corregir &&
				pedido?.IdCreador == localStorage.getItem('id') &&
				pedido?.Creador == localStorage.getItem('nombre')
			)
				arrayFiltrado.push(pedido);
		});

		return arrayFiltrado;
	};

	const filtrarPropios = () => {
		if (!organizateOrders) return [];
		let arrayFiltrado = [];

		organizateOrders()?.map((pedido) => {
			if (
				!pedido?.Corregir &&
				pedido?.IdCreador == localStorage.getItem('id') &&
				pedido?.Creador == localStorage.getItem('nombre')
			)
				arrayFiltrado.push(pedido);
		});

		return arrayFiltrado;
	};

	return (
		<div>
			<CardSection
				nombre='Corregir'
				isLoading={isLoading}
				content={filtrarPendientesCorrecion()}
			/>
			<CardSection
				nombre='Pedidos'
				isLoading={isLoading}
				content={filtrarPropios()}
			/>
		</div>
	);
};
