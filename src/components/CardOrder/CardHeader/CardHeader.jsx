import './CardHeader.css';
import messageIcon from '../../../assets/images/comment.png';

export const CardHeader = ({ profile, name, type, amountMessage }) => {
	return (
		<div className='CardHeader'>
			<img className='CardProfile' src={profile} />
			<div className='CardContent'>
				<label className='headlineSmall'>{name}</label>
				<p className='bodySmall'>{type}</p>
			</div>
			<div className='CardMessage'>
				<img className='icon' src={messageIcon} />
				<img className='amount' />
			</div>

			<img />
		</div>
	);
};
