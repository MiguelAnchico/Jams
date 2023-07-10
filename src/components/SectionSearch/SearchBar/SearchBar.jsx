import React, { useState } from 'react';
import iconSearch from '../../../assets/images/search.png';

import './SearchBar.css';

export const SearchBar = ({ getOrders }) => {
	const [id, setId] = useState('');
	const [category, setCategory] = useState('Id');

	const searchOrder = () => {
		if (id) getOrders({ key: category, value: id });
	};

	const handleKeyDown = (event) => {
		if (event.key == 'Enter') {
			searchOrder();
		}
	};

	return (
		<div className='SearchBar'>
			<img className='IconSearch' onClick={searchOrder} src={iconSearch} />
			<input
				className='bodySmall'
				onKeyDown={handleKeyDown}
				onChange={(e) => setId(e.target.value)}
				type={category != 'Fecha' ? 'text' : 'date'}
			/>
			<select
				className='bodySmall'
				onChange={(e) => setCategory(e.target.value)}
			>
				<option className='bodySmall' value='Id'>
					ID del Pedido
				</option>
				<option className='bodySmall' value='NombreCliente'>
					Nombre
				</option>
				<option className='bodySmall' value='CedulaCliente'>
					Cedula
				</option>
				<option className='bodySmall' value='Fecha'>
					Fecha
				</option>
				<option className='bodySmall' value='Whatsapp'>
					Celular
				</option>
				<option className='bodySmall' value='Estado'>
					Estado
				</option>
				<option className='bodySmall' value='Tipo'>
					Tipo
				</option>
				<option className='bodySmall' value='Creador'>
					Creador
				</option>
			</select>
		</div>
	);
};
