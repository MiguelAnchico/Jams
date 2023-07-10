import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
	createNewOrder,
	getOrders,
	getOrderByKeys,
	updateOrder,
	getSearchOrder,
} from '../api/Pedidos';

let key = 'orders';

export const useMutateOrder = () => {
	const queryClients = useQueryClient();

	return useMutation(createNewOrder, {
		onSuccess: () => {
			queryClients.invalidateQueries([key]);
		},
	});
};

export const useMutateUpdateOrder = () => {
	const queryClients = useQueryClient();

	return useMutation(updateOrder, {
		onSuccess: () => {
			queryClients.invalidateQueries([key]);
		},
	});
};

export const useOrders = () => {
	return useQuery([key], getOrders, {
		refetchInterval: 6000,
	});
};

export const useOrder = (orderId, refetch) => {
	return useQuery([key, orderId], () => getOrderByKeys(orderId), {
		refetchOnWindowFocus: false,
		refetchInterval: !refetch ? 6000 : 'none',
	});
};

export const useSearchOrder = () => {
	return useMutation(getSearchOrder, {
		onSuccess: (data) => {},
	});
};
