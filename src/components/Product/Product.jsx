import './Product.css';

export const Product = ({ code, name }) => {
	return (
		<div className='Product'>
			<p className='headlineSmall'>{code}</p>
			<p className='bodySmall'>
				{name.length <= 15 ? name.slice(0, 15) : name.slice(0, 15) + '...'}
			</p>
		</div>
	);
};
