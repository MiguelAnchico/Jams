import './BarProgress.css';

export const BarProgress = ({ borderRadius, width, color, isOrder }) => {
	return (
		<div
			className='BarProgress'
			style={
				isOrder
					? { position: 'absolute', bottom: '-8px' }
					: {
							borderRadius: borderRadius,
					  }
			}
		>
			<div
				className='Bar'
				style={{
					backgroundColor: color,
					width: width,
					borderRadius: borderRadius,
				}}
			></div>
		</div>
	);
};
