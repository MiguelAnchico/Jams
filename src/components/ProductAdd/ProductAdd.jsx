import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import { ModalProductAdd } from '../ModalProductAdd/ModalProductAdd';
import deleteIcon from './../../assets/images/delete.png';

import './ProductAdd.css';

export const ProductAdd = ({
	products,
	setProducts,
	envio,
	envioPlus,
	editMode,
}) => {
	const { eliminarElemento } = useNotificationsFeedback();
	const calculatePrice = (array) => {
		let total = 0;
		if (array.length > 0) {
			array.map((product) => {
				total += parseFloat(product.precio);
			});
		}

		total += envio ? parseFloat(envio) : 0;
		total += envioPlus ? parseFloat(envioPlus) : 0;

		return total;
	};

	const deleteProduct = (index) => {
		const arrayTest = [...products];
		arrayTest.splice(index, 1);
		setProducts(arrayTest);
		calculatePrice(arrayTest);
		eliminarElemento();
	};

	return (
		<div className='ProductAdd'>
			<p className='headlineSmall ProductAddTitle'>Productos*</p>
			{products?.map((producto, index) => (
				<div className='CardProductAdd'>
					<img
						className='ImagePreview'
						src={producto.imgPreviewProduct}
						alt=''
					/>
					<div>
						<p className='labelSmall'>{producto.codigo}</p>
						<p className='bodySmall'>{producto.nombre}</p>
					</div>
					<div>
						<p className='bodySmall'>
							Talla: <span className='labelSmall'>{producto.medida}</span>
						</p>
						<p className='bodySmall'>
							Color <span className='labelSmall'>{producto.color}</span>
						</p>
					</div>
					<div>
						<p className='bodySmall'>
							Precio:{' '}
							<span className='labelSmall'>
								{new Intl.NumberFormat('en-US', {
									style: 'currency',
									currency: 'USD',
									minimumFractionDigits: 0,
								}).format(producto.precio)}
							</span>
						</p>
						<p className='bodySmall'>
							Cantidad: <span className='labelSmall'>{producto.cantidad}</span>
						</p>
					</div>

					<img
						src={deleteIcon}
						className='Icon'
						onClick={(e) => deleteProduct(index)}
					/>
				</div>
			))}
			<ModalProductAdd
				setProducts={setProducts}
				products={products}
				recalcular={calculatePrice}
			/>
			<div className='Resume'>
				<p className='labelSmall OP6'>Total</p>
				<p className='labelSmall'>
					{new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: 'USD',
						minimumFractionDigits: 0,
					}).format(calculatePrice(products))}
				</p>
			</div>
		</div>
	);
};
