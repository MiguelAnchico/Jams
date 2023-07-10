import axios from 'axios';
import { url } from './Config';

const API = url;

export const login = async (post) => {
	const { data } = await axios.post(`${API}/login`, post);
	if (data.success) localStorage.setItem('user-token', data.success);
	return data;
};
