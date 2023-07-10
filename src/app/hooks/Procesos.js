import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
	createNewProcess,
	getProcess,
	getProcessByKeys,
} from '../api/Procesos';

let key = 'process';

export const useMutateProcess = () => {
	const queryClients = useQueryClient();

	return useMutation(createNewProcess, {
		onSuccess: () => {
			queryClients.invalidateQueries('orders');
		},
	});
};

export const useProceses = () => {
	return useQuery([key], getProcess);
};

export const useProcess = (processId) => {
	return useQuery([key, processId], () => getProcessByKeys(processId));
};
