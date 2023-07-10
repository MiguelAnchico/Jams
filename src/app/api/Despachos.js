import axios from 'axios';
import { url } from './Config';

const API = url;

export const getShippingByKeys = async ({ id, cedula, fecha }) => {
	const { data } = await axios.get(
		`${API}/despachos/id/${id}/cedula/${cedula}/fecha/${fecha}`
	);
	return data;
};

export const getShippings = async () => {
	const { data } = await axios.get(`${API}/despachos`);
	return data;
};

export const createNewShipping = async (post) => {
	const { data } = await axios.post(`${API}/despachos`, post);
	return data;
};

export const updateShipping = async ({ id, cedula, fecha, put }) => {
	const { data } = await axios.put(
		`${API}/despachos/id/${id}/cedula/${cedula}/Fecha/${fecha}`,
		put
	);

	return data;
};

export const deleteShipping = async ({ id, cedula, fecha }) => {
	const data = await axios.delete(
		`${API}/despachos/id/${id}/cedula/${cedula}/Fecha/${fecha}`
	);

	return data;
};
