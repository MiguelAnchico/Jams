import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
	createNewInPoint,
	getInPoints,
	getInPointByKeys,
	deleteInPoint,
	updateInPoint,
} from '../api/Recogen';

let key = 'inpoints';

export const useMutateInPoint = () => {
	const queryClients = useQueryClient();

	return useMutation(createNewInPoint, {
		onSuccess: () => {
			queryClients.invalidateQueries([key]);
		},
	});
};

export const useMutateUpdateInPoint = () => {
	const queryClients = useQueryClient();

	return useMutation(deleteInPoint, {
		onSuccess: () => {
			queryClients.invalidateQueries('orders');
		},
	});
};

export const useMutateDeleteInPoint = () => {
	const queryClients = useQueryClient();

	return useMutation(deleteInPoint, {
		onSuccess: () => {
			queryClients.invalidateQueries('orders');
		},
	});
};

export const useInPoints = () => {
	return useQuery([key], getInPoints);
};

export const useInPoint = (orderId) => {
	return useQuery([key, orderId], () => getInPointByKeys(orderId));
};
