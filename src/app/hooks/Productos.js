import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
	createNewProduct,
	getProducts,
	getProductByKeys,
	updateProduct,
	deleteProduct,
} from '../api/Productos';

let key = 'products';

export const useMutateProduct = () => {
	const queryClients = useQueryClient();

	return useMutation(createNewProduct, {
		onSuccess: () => {
			queryClients.invalidateQueries([key]);
		},
	});
};

export const useMutateUpdateProduct = () => {
	const queryClients = useQueryClient();

	return useMutation(updateProduct, {
		onSuccess: () => {
			queryClients.invalidateQueries(['orders']);
		},
	});
};

export const useMutateDeleteProduct = () => {
	const queryClients = useQueryClient();

	return useMutation(deleteProduct, {
		onSuccess: () => {
			queryClients.invalidateQueries(['orders']);
		},
	});
};

export const useProducts = () => {
	return useQuery([key], getProducts);
};

export const useProduct = (orderId) => {
	return useQuery([key, orderId], () => getProductByKeys(orderId));
};
