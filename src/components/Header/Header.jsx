import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/images/logo.webp';
import setting from '../../assets/images/setting.png';

import { BarProgress } from '../BarProgress/BarProgress';
import flechaAtras from '../../assets/images/flecha-izquierda.png';

import './Header.css';

export const Header = ({
	number,
	state,
	price,
	date,
	type,
	isOrder,
	width,
	color,
	isHome,
	url,
	isRevision,
	isFixed,
}) => {
	const navigate = useNavigate();

	const closeSesion = () => {
		localStorage.removeItem('user-token');
		localStorage.removeItem('nombre');
		localStorage.removeItem('role');
		localStorage.removeItem('id');
		window.location.href = '/';
	};
	return (
		<div
			className='Header'
			style={isRevision || isFixed ? { marginTop: '24px' } : {}}
		>
			<img
				className='logo'
				src={logo}
				onClick={() => navigate('/home')}
				alt='logo'
			/>
			{number ? (
				<>
					<div className='HeaderOrder'>
						<div className='HeaderOrderID'>
							<h1>Pedido #{number}</h1>
							<p className='bodySmall OP6'>
								Estado: <span className='headlineSmall OP6'>{state}</span>
							</p>
						</div>

						<div className='HeaderText'>
							<p className='labelMedium'>{price}</p>
							<p className='bodySmall OP6'>{date}</p>
							<p className='headlineSmall OP6'>{type}</p>
						</div>
					</div>
					<div
						className='AvisoRevision labelSmall'
						style={isRevision ? {} : { display: 'none' }}
					>
						En estado de revision
					</div>
					<div
						className='AvisoCorrecion labelSmall'
						style={isFixed ? {} : { display: 'none' }}
					>
						Pendiente por corregir
					</div>
				</>
			) : (
				<div className='profileOptions'>
					{/*<img className='settings' src={setting} alt='settings' />*/}
					<div className='profileInfo'>
						<div className='imageProfile labelSmall'>
							{localStorage.getItem('nombre')[0]}
						</div>
						<p className='bodySmall'>{localStorage.getItem('nombre')}</p>
					</div>
					<a className='labelSmall closeSesion' onClick={closeSesion}>
						Cerrar sesion
					</a>
				</div>
			)}

			{isOrder ? (
				<BarProgress
					number={number}
					isOrder={isOrder}
					width={width}
					color={color}
				/>
			) : (
				<></>
			)}
			{!isHome ? (
				<img
					src={flechaAtras}
					onClick={() => navigate(url)}
					className='BackArrow'
				/>
			) : (
				<></>
			)}
		</div>
	);
};
