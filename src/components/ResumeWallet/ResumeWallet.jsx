import { useEffect, useState } from 'react';
import { usePaymentsDate } from '../../app/hooks/Pagos';
import close from '../../assets/images/close.png';

import './ResumeWallet.css';

export const ResumeWallet = () => {
	const [visible, setVisible] = useState(false);
	const [date, setDate] = useState(new Date());
	const [addi, setAddi] = useState([]);
	const [suPay, setSuPay] = useState([]);
	const [esMio, setEsMio] = useState([]);
	const [tuCuota, setTuCuota] = useState([]);
	const [sistecredito, setSistecredito] = useState([]);

	const {
		data: payments,
		error,
		isLoading,
		isFetching,
	} = usePaymentsDate(date);

	useEffect(() => {
		if (!isLoading) {
			let addi = { pedidos: [], valor: 0 };
			let suPay = { pedidos: [], valor: 0 };
			let esMio = { pedidos: [], valor: 0 };
			let tuCuota = { pedidos: [], valor: 0 };
			let sistecredito = { pedidos: [], valor: 0 };

			payments?.map((pago) => {
				console.log(pago);
				if (!pago?.Pedido?.Facturado) {
					if (pago.Medio == 'Addi') {
						addi.pedidos = [...addi.pedidos, pago.IdPedido];
						addi.valor += parseFloat(pago.Valor);
						return;
					}
					if (pago.Medio == 'Su+Pay') {
						suPay.pedidos = [...suPay.pedidos, pago.IdPedido];
						suPay.valor += parseFloat(pago.Valor);
						return;
					}
					if (pago.Medio == 'EsMio') {
						esMio.pedidos = [...esMio.pedidos, pago.IdPedido];
						esMio.valor += parseFloat(pago.Valor);
						return;
					}
					if (pago.Medio == 'TuCuota') {
						tuCuota.pedidos = [...tuCuota.pedidos, pago.IdPedido];
						tuCuota.valor += parseFloat(pago.Valor);
						return;
					}
					if (pago.Medio == 'Sistecredito') {
						sistecredito.pedidos = [...sistecredito.pedidos, pago.IdPedido];
						sistecredito.valor += parseFloat(pago.Valor);
						return;
					}
				}
			});

			setAddi(addi);
			setSuPay(suPay);
			setEsMio(esMio);
			setTuCuota(tuCuota);
			setSistecredito(sistecredito);
		}
	}, [payments]);

	useEffect(() => {}, [date]);

	return (
		<div className='ResumeWallet'>
			<button
				className='button buttonCajero labelSmall'
				onClick={(e) => setVisible(true)}
			>
				Resumen de Financieras
			</button>

			{visible ? (
				<div>
					<div className='ResumeWalletContainer'>
						<img
							src={close}
							className='CloseModal'
							onClick={(e) => setVisible(false)}
						/>
						<div className='ResumeWalletTitle'>
							<h2>Fecha de pagos sin facturar</h2>
							<p className='bodyMedium'>{date.toISOString().split('T', 1)}</p>
							<input
								type='date'
								className='bodySmall select OP6 select'
								onChange={(e) => setDate(new Date(e.target.value))}
							/>
						</div>
						<div className='ResumeWalletContent'>
							<p className='headlineSmall OP6'>Financiera</p>
							<p className='headlineSmall OP6'>Valor sin facturar</p>
							<p className='headlineSmall OP6'>ID Pedidos</p>

							<>
								<p className='headlineSmall'>Addi</p>
								<p className='bodySmall'>
									{new Intl.NumberFormat('en-US', {
										style: 'currency',
										currency: 'USD',
										minimumFractionDigits: 0,
									}).format(addi?.valor)}
								</p>
								<div>
									{addi?.pedidos?.map((pedido) => (
										<p className='bodySmall'>{pedido}</p>
									))}
								</div>
							</>
							<>
								<p className='headlineSmall'>Su+Pay</p>
								<p className='bodySmall'>
									{new Intl.NumberFormat('en-US', {
										style: 'currency',
										currency: 'USD',
										minimumFractionDigits: 0,
									}).format(suPay?.valor)}
								</p>
								<div>
									{suPay?.pedidos?.map((pedido) => (
										<p className='bodySmall'>{pedido}</p>
									))}
								</div>
							</>
							<>
								<p className='headlineSmall'>EsMio</p>
								<p className='bodySmall'>
									{new Intl.NumberFormat('en-US', {
										style: 'currency',
										currency: 'USD',
										minimumFractionDigits: 0,
									}).format(esMio?.valor)}
								</p>
								<div>
									{esMio?.pedidos?.map((pedido) => (
										<p className='bodySmall'>{pedido}</p>
									))}
								</div>
							</>
							<>
								<p className='headlineSmall'>TuCuota</p>
								<p className='bodySmall'>
									{new Intl.NumberFormat('en-US', {
										style: 'currency',
										currency: 'USD',
										minimumFractionDigits: 0,
									}).format(tuCuota?.valor)}
								</p>
								<div>
									{tuCuota?.pedidos?.map((pedido) => (
										<p className='bodySmall'>{pedido}</p>
									))}
								</div>
							</>
							<>
								<p className='headlineSmall'>Sistecredito</p>
								<p className='bodySmall'>
									{new Intl.NumberFormat('en-US', {
										style: 'currency',
										currency: 'USD',
										minimumFractionDigits: 0,
									}).format(sistecredito?.valor)}
								</p>
								<div>
									{sistecredito?.pedidos?.map((pedido) => (
										<p className='bodySmall'>{pedido}</p>
									))}
								</div>
							</>
						</div>
					</div>
					<div
						className='ModalBackground'
						onClick={(e) => setVisible(false)}
					></div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};
