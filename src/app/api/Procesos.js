import axios from 'axios';
import { url } from './Config';

const API = url;

export const getProcessByKeys = async ({ id, cedula, fecha, fechaProceso }) => {
	const { data } = await axios.get(
		`${API}/procesos/id/${id}/cedula/${cedula}/fecha/${fecha}/fechaProceso/${fechaProceso}`
	);
	return data;
};

export const getProcess = async () => {
	const { data } = await axios.get(`${API}/procesos`);
	return data;
};

export const createNewProcess = async (post) => {
	const { data } = await axios.post(`${API}/procesos`, post);
	return data;
};

export const updateProcess = async ({
	id,
	cedula,
	fecha,
	fechaProceso,
	put,
}) => {
	const { data } = await axios.put(
		`${API}/procesos/id/${id}/cedula/${cedula}/fecha/${fecha}/fechaProceso/${fechaProceso}`,
		put
	);

	return data;
};

export const deleteProcess = async ({ id, cedula, fecha, fechaProceso }) => {
	const data = await axios.delete(
		`${API}/procesos/id/${id}/cedula/${cedula}/fecha/${fecha}/fechaProceso/${fechaProceso}`
	);

	return data;
};
