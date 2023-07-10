import { useState } from 'react';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';
import iconAccept from '../../assets/images/accept.png';
import iconCancel from '../../assets/images/cancel.png';
import iconInfo from '../../assets/images/info.png';
import iconWarning from '../../assets/images/warning.png';

import './ActionPopUp.css';

export const ActionPopUp = () => {
	const [type, setType] = useState('');
	const [title, setTitle] = useState('');
	const [info, setInfo] = useState('');

	const selectIcon = () => {
		if (type === 'Warning') return iconWarning;
		if (type === 'Success') return iconAccept;
		if (type === 'Cancel') return iconCancel;
		if (type === 'Info') return iconInfo;

		return '';
	};

	window.addEventListener('storage', () => {
		setType(localStorage.getItem('type'));
		setTitle(localStorage.getItem('title'));
		setInfo(localStorage.getItem('info'));
	});

	return (
		<div className='ActionPopUp' style={{ display: 'none' }}>
			<img src={selectIcon()} />
			<div>
				<p>{title}</p>
				<p>{info}</p>
			</div>
		</div>
	);
};
