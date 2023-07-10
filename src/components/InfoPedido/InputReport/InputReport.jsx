import React from 'react';
import alertIcon from '../../../assets/images/advertencia.png';

import './InputReport.css';

export const InputReport = ({ fieldTitle, fieldValue, fieldHook }) => {
	return (
		<div className='InputReportContainer'>
			<p className='headlineSmall'>{fieldTitle}</p>
			<div className='InputReport'>
				<p className='bodySmall'>{fieldValue}</p>
				<img
					src={alertIcon}
					className='alertIcon'
					onClick={(e) => fieldHook('Corregir el campo ' + fieldTitle)}
				/>
			</div>
		</div>
	);
};
