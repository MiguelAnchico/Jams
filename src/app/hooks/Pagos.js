import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
	createNewPayment,
	getPayments,
	getPaymentByKeys,
	updatePayment,
	deletePayment,
	getPaymentsDate,
} from '../api/Pagos';

let key = 'payments';

export const useMutatePayment = () => {
	const queryClients = useQueryClient();

	return useMutation(createNewPayment, {
		onSuccess: () => {
			queryClients.invalidateQueries([key]);
		},
	});
};

export const useMutateUpdatePayment = () => {
	const queryClients = useQueryClient();

	return useMutation(updatePayment, {
		onSuccess: () => {
			queryClients.invalidateQueries('orders');
		},
	});
};

export const useMutateDeletePayment = () => {
	const queryClients = useQueryClient();

	return useMutation(deletePayment, {
		onSuccess: () => {
			queryClients.invalidateQueries('orders');
		},
	});
};

export const usePayments = () => {
	return useQuery([key], getPayments);
};

export const usePayment = (paymentId) => {
	return useQuery([key, paymentId], () => getPaymentByKeys(paymentId));
};

export const usePaymentsDate = (date) => {
	return useQuery([key, date], () => getPaymentsDate(date.toISOString()));
};
