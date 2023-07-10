import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
	createNewDelivery,
	getDeliveries,
	getDeliveryByKeys,
	updateDelivery,
	deleteDelivery,
} from '../api/Domicilios';

let key = 'deliveries';

export const useMutateDelivery = () => {
	const queryClients = useQueryClient();

	return useMutation(createNewDelivery, {
		onSuccess: () => {
			queryClients.invalidateQueries('orders');
		},
	});
};

export const useMutateUpdateDelivery = () => {
	const queryClients = useQueryClient();

	return useMutation(updateDelivery, {
		onSuccess: () => {
			queryClients.invalidateQueries('orders');
		},
	});
};

export const useMutateDeleteDelivery = () => {
	const queryClients = useQueryClient();

	return useMutation(deleteDelivery, {
		onSuccess: () => {
			queryClients.invalidateQueries('orders');
		},
	});
};

export const useDeliveries = () => {
	return useQuery([key], getDeliveries);
};

export const useDelivery = (orderId) => {
	return useQuery([key, orderId], () => getDeliveryByKeys(orderId));
};
