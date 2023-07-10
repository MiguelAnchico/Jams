import axios from 'axios';
import { url } from './Config';

const API = url;

export const getDeliveryByKeys = async ({ id, cedula, fecha }) => {
	const { data } = await axios.get(
		`${API}/domicilios/id/${id}/cedula/${cedula}/fecha/${fecha}`
	);
	return data;
};

export const getDeliveries = async () => {
	const { data } = await axios.get(`${API}/domicilios`);
	return data;
};

export const createNewDelivery = async (post) => {
	const { data } = await axios.post(`${API}/domicilios`, post);
	return data;
};

export const updateDelivery = async ({ id, cedula, fecha, put }) => {
	const { data } = await axios.put(
		`${API}/domicilios/id/${id}/cedula/${cedula}/Fecha/${fecha}`,
		put
	);

	return data;
};

export const deleteDelivery = async ({ id, cedula, fecha }) => {
	const data = await axios.delete(
		`${API}/domicilios/id/${id}/cedula/${cedula}/Fecha/${fecha}`
	);

	return data;
};
