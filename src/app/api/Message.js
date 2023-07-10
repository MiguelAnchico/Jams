import axios from 'axios';
import { url } from './Config';

const API = url;

export const getMessageByKeys = async ({ id, cedula, fecha }) => {
	const { data } = await axios.get(
		`${API}/message/id/${id}/cedula/${cedula}/fecha/${fecha}`
	);
	return data;
};

export const createNewMessage = async (post) => {
	const { data } = await axios.post(`${API}/message`, post);
	return data;
};
