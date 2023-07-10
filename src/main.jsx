import React from 'react';
import ReactDOM from 'react-dom/client';

import { Login } from './pages/Login/Login';
import { Home } from './pages/Home/Home';
import { NewOrder } from './pages/NewOrder/NewOrder';
import { Order } from './pages/Order/Order';
import { EditOrder } from './pages/EditOrder/EditOrder';

import './main.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { AxiosInterceptor } from './app/interceptor/AuthInterceptor';
import { Toaster } from 'react-hot-toast';

AxiosInterceptor();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Toaster />
			<BrowserRouter>
				<Routes>
					<Route exact path='/' element={<Login />} />
					<Route path='/home' element={<Home />} />
					<Route path='/new-order' element={<NewOrder />} />
					<Route path='/order' element={<Order />} />
					<Route path='/edit-order' element={<EditOrder />} />
				</Routes>
			</BrowserRouter>
			<ReactQueryDevtools />
		</QueryClientProvider>
	</React.StrictMode>
);
