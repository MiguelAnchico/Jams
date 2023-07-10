import axios from 'axios';
import { url } from './Config';

const API = url;

export const getPaymentByKeys = async ({
	id,
	cedula,
	fecha,
	tipo,
	medio,
	idPago,
}) => {
	const { data } = await axios.get(
		`${API}/pagos/id/${id}/cedula/${cedula}/fecha/${fecha}/tipo/${tipo}/medio/${medio}/idPago/${idPago}`
	);
	return data;
};

export const getPayments = async () => {
	const { data } = await axios.get(`${API}/pagos`);
	return data;
};

export const getPaymentsDate = async (date) => {
	const { data } = await axios.get(`${API}/pagos/fecha/` + date);
	return data;
};

export const createNewPayment = async (post) => {
	const form = new FormData();
	Object.keys(post).forEach((key) => {
		form.append(key, post[key]);
	});
	const { data } = await axios.post(`${API}/pagos`, form);
	return data;
};

export const updatePayment = async ({
	id,
	cedula,
	fecha,
	tipo,
	medio,
	idPago,
	put,
}) => {
	const { data } = await axios.put(
		`${API}/pagos/id/${id}/cedula/${cedula}/fecha/${fecha}/tipo/${tipo}/medio/${medio}/idPago/${idPago}`,
		put
	);

	return data;
};

export const deletePayment = async ({
	id,
	cedula,
	fecha,
	tipo,
	medio,
	idPago,
}) => {
	const data = await axios.delete(
		`${API}/pagos/id/${id}/cedula/${cedula}/fecha/${fecha}/tipo/${tipo}/medio/${medio}/idPago/${idPago}`
	);

	return data;
};
