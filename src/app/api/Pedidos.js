import axios from 'axios';
import { url } from './Config';

const API = url;

export const getOrderByKeys = async ({ id, cedula, fecha }) => {
	const { data } = await axios.get(
		`${API}/pedidos/id/${id}/cedula/${cedula}/fecha/${fecha}`
	);

	return data;
};

export const getOrders = async () => {
	const { data } = await axios.get(`${API}/pedidos`);

	return data;
};

export const getSearchOrder = async ({ key, value }) => {
	const { data } = await axios.get(`${API}/pedidos/key/${key}/value/${value}`);

	return data;
};

export const createNewOrder = async (post) => {
	const { data } = await axios.post(`${API}/pedidos`, post);
	return data;
};

export const updateOrder = async ({ id, cedula, fecha, put }) => {
	const { data } = await axios.put(
		`${API}/pedidos/id/${id}/cedula/${cedula}/fecha/${fecha}`,
		put
	);

	return data;
};

export const deleteOrder = async ({ id, cedula, fecha }) => {
	const data = await axios.delete(
		`${API}/pedidos/id/${id}/cedula/${cedula}/fecha/${fecha}`
	);

	return data;
};
