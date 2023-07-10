import { useState } from 'react';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';

import { LoginRol } from '../../components/LoginRol/LoginRol';
import { LoginForm } from '../../components/LoginForm/LoginForm';

import './Login.css';

export const Login = () => {
	const { errorDatos } = useNotificationsFeedback();
	const [role, setRole] = useState(null);

	if (localStorage.getItem('status') == 'Vencido') {
		errorDatos();
		localStorage.setItem('status', '');
	}

	return (
		<div className='Login'>
			{role != null ? (
				<LoginForm setRole={setRole} role={role} />
			) : (
				<LoginRol setRole={setRole} />
			)}
		</div>
	);
};
