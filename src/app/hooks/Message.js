import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getMessageByKeys, createNewMessage } from '../api/Message';

let key = 'orders';

export const useMessages = () => {
	return useQuery([key], getMessageByKeys);
};

export const useMutateMessage = () => {
	const queryClients = useQueryClient();

	return useMutation(createNewMessage, {
		onSuccess: () => {
			queryClients.invalidateQueries([key]);
		},
	});
};
