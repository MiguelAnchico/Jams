import axios from 'axios';
import { url } from './Config';

const API = url;

export const getInPointByKeys = async ({ id, cedula, fecha }) => {
	const { data } = await axios.get(
		`${API}/recogen/id/${id}/cedula/${cedula}/fecha/${fecha}`
	);
	return data;
};

export const getInPoints = async () => {
	const { data } = await axios.get(`${API}/recogen`);
	return data;
};

export const createNewInPoint = async (post) => {
	const { data } = await axios.post(`${API}/recogen`, post);
	return data;
};

export const updateInPoint = async ({ id, cedula, fecha, put }) => {
	const { data } = await axios.put(
		`${API}/recogen/id/${id}/cedula/${cedula}/Fecha/${fecha}`,
		put
	);

	return data;
};

export const deleteInPoint = async ({ id, cedula, fecha }) => {
	const data = await axios.delete(
		`${API}/recogen/id/${id}/cedula/${cedula}/Fecha/${fecha}`
	);

	return data;
};
