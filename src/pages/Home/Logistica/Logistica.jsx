import React from 'react';
import { CardSection } from '../../../components/CardSection/CardSection';

export const Logistica = ({ organizateOrders, isLoading }) => {
	const filtrarInmediatos = () => {
		if (!organizateOrders) return [];
		let arrayFiltrado = [];

		organizateOrders()?.map((pedido) => {
			let difference = new Date().getTime() - new Date(pedido?.Fecha).getTime();
			let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

			if (
				TotalDays > 2 &&
				pedido.Estado != 'Devolucion' &&
				pedido.Estado != 'Distribucion' &&
				pedido.Estado != 'Entregado' &&
				pedido.Estado != 'Cancelado'
			)
				arrayFiltrado.push(pedido);
		});

		return arrayFiltrado;
	};

	const filtrarNuevos = () => {
		if (!organizateOrders) return [];
		let arrayFiltrado = [];

		organizateOrders()?.map((pedido) => {
			let difference = new Date().getTime() - new Date(pedido?.Fecha).getTime();
			let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

			if (pedido.Estado == 'Creado' && TotalDays <= 2)
				arrayFiltrado.push(pedido);
		});

		return arrayFiltrado;
	};

	const filtrarEnProceso = () => {
		if (!organizateOrders) return [];
		let arrayFiltrado = [];

		organizateOrders()?.map((pedido) => {
			let difference = new Date().getTime() - new Date(pedido?.Fecha).getTime();
			let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

			if (
				TotalDays <= 2 &&
				pedido.Estado != 'Creado' &&
				!(
					pedido.Estado == 'Devolucion' ||
					pedido.Estado == 'Retornado' ||
					pedido.Estado == 'Regresando' ||
					pedido.Estado == 'En Retorno'
				) &&
				!(pedido.Estado == 'Distribucion' || pedido.Estado == 'Entregado')
			)
				arrayFiltrado.push(pedido);
		});

		return arrayFiltrado;
	};

	const filtrarDespachado = () => {
		if (!organizateOrders) return [];
		let arrayFiltrado = [];

		organizateOrders()?.map((pedido) => {
			let difference = new Date().getTime() - new Date(pedido?.Fecha).getTime();
			let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));

			if (
				pedido.Estado != 'Creado' &&
				!(
					pedido.Estado == 'Devolucion' ||
					pedido.Estado == 'Retornado' ||
					pedido.Estado == 'Regresando' ||
					pedido.Estado == 'En Retorno'
				) &&
				(pedido.Estado == 'Distribucion' || pedido.Estado == 'Entregado')
			)
				arrayFiltrado.push(pedido);
		});

		return arrayFiltrado;
	};

	const filtrarEnDevolucionGarantia = () => {
		if (!organizateOrders) return [];
		let arrayFiltrado = [];

		organizateOrders()?.map((pedido) => {
			if (
				pedido.Estado == 'Devolucion' ||
				pedido.Estado == 'Retornado' ||
				pedido.Estado == 'Regresando' ||
				pedido.Estado == 'En Retorno'
			)
				arrayFiltrado.push(pedido);
		});

		return arrayFiltrado;
	};

	return (
		<div>
			<CardSection
				nombre='Inmediato'
				isLoading={isLoading}
				content={filtrarInmediatos()}
			/>
			<CardSection
				nombre='Nuevos'
				isLoading={isLoading}
				content={filtrarNuevos()}
			/>

			<CardSection
				nombre='En Proceso'
				isLoading={isLoading}
				content={filtrarEnProceso()}
			/>

			<CardSection
				nombre='Despachados'
				isLoading={isLoading}
				content={filtrarDespachado()}
			/>

			<CardSection
				nombre='Devoluciones y garantias'
				isLoading={isLoading}
				content={filtrarEnDevolucionGarantia()}
			/>
		</div>
	);
};
