import React, { useEffect, useState } from 'react';

export const Roles = () => {
	const [administrador, setAdministrador] = useState(false);
	const [logistica, setLogistica] = useState(false);
	const [cajero, setCajero] = useState(false);
	const [contador, setContador] = useState(false);
	const [asesor, setAsesor] = useState(false);

	useEffect(() => {
		if (localStorage.getItem('role') == 'Logistica') setLogistica(true);
		if (localStorage.getItem('role') == 'Cajero') setCajero(true);
		if (localStorage.getItem('role') == 'Asesor') setAsesor(true);
		if (localStorage.getItem('role') == 'Contador') setContador(true);
		if (localStorage.getItem('role') == 'Administrador') {
			setAdministrador(true);
			setContador(true);
			setAsesor(true);
			setCajero(true);
			setLogistica(true);
		}
	}, []);
	return {
		administrador,
		logistica,
		cajero,
		contador,
		asesor,
	};
};
