import axios from 'axios';
import { url } from './Config';

const API = url;

export const getProductByKeys = async ({
	id,
	cedula,
	fecha,
	codigo,
	medida,
	IdProducto,
	color,
}) => {
	const { data } = await axios.get(
		`${API}/productos/id/${id}/cedula/${cedula}/fecha/${fecha}/codigo/${codigo}/medida/${medida}/color/${color}/idProducto/${IdProducto}`
	);
	return data;
};

export const getProducts = async () => {
	const { data } = await axios.get(`${API}/productos`);
	return data;
};

export const createNewProduct = async (post) => {
	const form = new FormData();
	Object.keys(post).forEach((key) => {
		form.append(key, post[key]);
	});

	const { data } = await axios.post(`${API}/productos`, form);
	return data;
};

export const updateProduct = async ({
	id,
	cedula,
	fecha,
	codigo,
	medida,
	color,
	IdProducto,
	put,
}) => {
	const { data } = await axios.put(
		`${API}/productos/id/${id}/cedula/${cedula}/fecha/${fecha}/codigo/${codigo}/medida/${medida}/color/${color}/idProducto/${IdProducto}`,
		put
	);

	return data;
};

export const deleteProduct = async ({
	id,
	cedula,
	fecha,
	codigo,
	medida,
	IdProducto,
	color,
}) => {
	const data = await axios.delete(
		`${API}/productos/id/${id}/cedula/${cedula}/fecha/${fecha}/codigo/${codigo}/medida/${medida}/color/${color}/idProducto/${IdProducto}`
	);

	return data;
};
