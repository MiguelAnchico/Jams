import { useState } from 'react';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { ModalPaymentAdd } from '../ModalPaymentAdd/ModalPaymentAdd';
import deleteIcon from './../../assets/images/delete.png';

import './PaymentAdd.css';

export const PaymentAdd = ({
	payments,
	setPayments,
	envioPlus,
	valorEnvio,
	tipoEnvio,
}) => {
	const { eliminarElemento } = useNotificationsFeedback();
	const calculatePrice = (array) => {
		let total = 0;
		if (array.length > 0) {
			array.map((payment) => {
				total += parseFloat(payment.valor);
			});
		}

		total += parseFloat(valorEnvio ? valorEnvio : 0);

		return total;
	};

	const deleteProduct = (index) => {
		const arrayTest = [...payments];
		const paymentOut = arrayTest.splice(index, 1);
		if (paymentOut[0].medio === 'Droppi') envioPlus('');

		eliminarElemento();
		setPayments(arrayTest);
		calculatePrice(arrayTest);
	};

	return (
		<div className='ProductAdd'>
			<p className='headlineSmall ProductAddTitle'>Metodos de pago*</p>
			{payments?.map((pago, index) => (
				<div className='CardPaymentAdd' key={index}>
					<img className='ImagePreview' src={pago.previewImage} />
					<div>
						<p className='bodySmall'>
							Tipo: <span className='labelSmall'>{pago.tipoPago}</span>
						</p>
						<p className='bodySmall'>
							Medio: <span className='labelSmall'>{pago.medio}</span>
						</p>
					</div>
					<div>
						<p className='bodySmall'>
							Valor:{' '}
							<span className='labelSmall'>
								{new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
									minimumFractionDigits: 0,
								}).format(pago.valor)}
							</span>
						</p>
						<p className='bodySmall'>
							{pago.medio == 'Droppi' ? (
								<>
									Comision:{' '}
									<span className='labelSmall'>
										{new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: 'USD',
											minimumFractionDigits: 0,
										}).format(pago.comisionDroppi)}
									</span>
									<br />
									Total:{' '}
									<span className='labelSmall'>
										{new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency: 'USD',
											minimumFractionDigits: 0,
										}).format(
											parseFloat(pago.valor) + parseFloat(pago.comisionDroppi)
										)}
									</span>
								</>
							) : (
								<>
									fecha:{' '}
									<span className='labelSmall'>
										{new Date(pago.fecha).toLocaleString('es-CO')}
									</span>
								</>
							)}
						</p>
					</div>

					<img
						src={deleteIcon}
						className='Icon'
						onClick={(e) => deleteProduct(index)}
					/>
				</div>
			))}
			<ModalPaymentAdd
				setPayments={setPayments}
				payments={payments}
				recalcular={calculatePrice}
				envioPlus={envioPlus}
				tipoEnvio={tipoEnvio}
			/>
			<div className='Resume'>
				<p className='labelSmall OP6'>Total</p>
				<p className='labelSmall'>
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
						minimumFractionDigits: 0,
					}).format(calculatePrice(payments))}
				</p>
			</div>
		</div>
	);
};
