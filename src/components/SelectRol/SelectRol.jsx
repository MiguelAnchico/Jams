import arrow from '../../assets/images/right-arrow.png';
import './SelectRol.css';

export const SelectRol = ({ IconRol, Info, RolName, onClick }) => {
	return (
		<div className='SelectRole' onClick={onClick}>
			<img className='IconRol' src={IconRol} />
			<p className='bodyMedium'>
				{Info}
				<span className='headlineMedium'> {RolName}</span>
			</p>
			<img className='IconArrow' src={arrow} />
		</div>
	);
};
