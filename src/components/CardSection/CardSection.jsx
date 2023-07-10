import { CardOrder } from '../CardOrder/CardOrder';
import { Spinner } from '../Spinner/Spinner';

import downArrow from '../../assets/images/down-arrow.png';
import upArrow from '../../assets/images/arrow-up.png';
import listaIcon from '../../assets/images/lista.png';
import piecesIcon from '../../assets/images/pieces.png';

import './CardSection.css';

import { calcularAvance } from '../../utils/ColorState';
import { useEffect, useState } from 'react';

export const CardSection = ({
	nombre,
	info,
	content,
	isLoading,
	isContador,
	isSearch,
}) => {
	const [tableView, setTableView] = useState(true);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		if (isSearch) setVisible(false);
	}, []);

	return (
		<div className='CardSection'>
			<div className='CardSectionTitle'>
				<p className='headlineLarge'>{nombre}</p>
				<img
					src={downArrow}
					style={!visible ? { display: 'none' } : {}}
					alt='arrow'
					onClick={(e) => setVisible(false)}
				/>
				<img
					src={upArrow}
					style={visible ? { display: 'none' } : {}}
					alt='arrow'
					onClick={(e) => setVisible(true)}
				/>
			</div>
			{visible ? (
				<div
					className='CardSectionContent'
					style={
						tableView
							? {
									justifyContent: 'center',
									display: 'flex',
							  }
							: {
									justifyContent: 'space-between',
									gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
									gap: '32px',
							  }
					}
				>
					{tableView ? (
						<div
							className='CardSectionTableTitle'
							style={
								isContador
									? {
											gridTemplateColumns:
												'minmax(200px,1fr) minmax(200px,1fr) minmax(300px,1fr) minmax(100px,1fr) minmax(100px,1fr) minmax(100px,1fr) minmax(100px,1fr) minmax(100px,1fr)',
									  }
									: {}
							}
						>
							<p className='headlineSmall OP6'>Foto</p>
							<p className='headlineSmall OP6'>Informacion del pedido</p>
							<p className='headlineSmall OP6'>Informacion del cliente</p>
							<p className='headlineSmall OP6'>Tipo de pedido</p>
							{isContador ? (
								<p className='headlineSmall OP6'>Pendiente confirmacion</p>
							) : (
								<></>
							)}
							<p className='headlineSmall OP6'>Facturado</p>
							<p className='headlineSmall OP6'>Creacion</p>
							<p className='headlineSmall OP6'>Expandir</p>
						</div>
					) : (
						<></>
					)}
					<div className='CardSectionIcon'>
						<img
							src={listaIcon}
							className='CardSectionIconOption'
							onClick={(e) => setTableView(true)}
							style={tableView ? { filter: 'grayscale(1)' } : {}}
						/>
						<img
							src={piecesIcon}
							className='CardSectionIconOption'
							onClick={(e) => setTableView(false)}
							style={!tableView ? { filter: 'grayscale(1)' } : {}}
						/>
					</div>
					{info}
					{isLoading ? (
						<Spinner />
					) : (
						content?.map((order) => (
							<CardOrder
								key={order.Id}
								imagen={order?.Productos[0]?.Foto}
								imagen1={order?.Productos[1] ? order?.Productos[1]?.Foto : ''}
								imagen2={order?.Productos[2] ? order?.Productos[2]?.Foto : ''}
								nombreCreador={order.Creador}
								tipoEnvio={order.Tipo}
								nombre={order.NombreCliente}
								estado={order.Estado}
								fecha={order.Fecha}
								cedula={order.CedulaCliente}
								whatsapp={order.Whatsapp}
								productos={order.Productos}
								facturado={order.Facturado}
								id={order.Id}
								mobile={tableView}
								style={calcularAvance(order)}
								corregir={order.Corregir}
								isContador={isContador}
								pagos={order.Pagos}
								revision={order.Revision}
								agendado={
									order?.Tipo == 'Domicilio' ? order?.Domicilio?.Agendado : ''
								}
							/>
						))
					)}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};
