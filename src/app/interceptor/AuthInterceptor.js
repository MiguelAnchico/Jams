import axios from 'axios';

axios.defaults.headers.common['Content-Type'] = 'application/json';

export const AxiosInterceptor = () => {
	axios.interceptors.request.use((request) => {
		const token = localStorage.getItem('user-token');
		if (token) request.headers['user-token'] = token;

		return request;
	});

	axios.interceptors.response.use(
		(response) => {
			if (response?.data?.error === 'El token ha expirado') {
				localStorage.removeItem('user-token');
				localStorage.setItem('status', 'vencido');
				window.location.href = '/';
			}

			return response;
		},
		(error) => {
			if (
				error?.response?.data?.error ===
				'Debes incluir el user-token en la cabezera'
			)
				window.location.href = '/';
		}
	);
};
