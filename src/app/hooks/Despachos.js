import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
	createNewShipping,
	getShippings,
	getShippingByKeys,
	updateShipping,
	deleteShipping,
} from '../api/Despachos';

let key = 'shippings';

export const useMutateShipping = () => {
	const queryClients = useQueryClient();

	return useMutation(createNewShipping, {
		onSuccess: () => {
			queryClients.invalidateQueries([key]);
		},
	});
};

export const useMutateUpdateShipping = () => {
	const queryClients = useQueryClient();

	return useMutation(updateShipping, {
		onSuccess: () => {
			queryClients.invalidateQueries('orders');
		},
	});
};

export const useMutateDeleteShipping = () => {
	const queryClients = useQueryClient();

	return useMutation(deleteShipping, {
		onSuccess: () => {
			queryClients.invalidateQueries('orders');
		},
	});
};

export const useShippings = () => {
	return useQuery([key], getShippings);
};

export const useShipping = (orderId) => {
	return useQuery([key, orderId], () => getShippingByKeys(orderId));
};
