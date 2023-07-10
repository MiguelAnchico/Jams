import { SelectRol } from '../../components/SelectRol/SelectRol';
import './LoginRol.css';

import asesor from '../../assets/images/vendedor-telefonico.png';
import logistica from '../../assets/images/repartidor.png';
import cajero from '../../assets/images/cajero.png';
import contador from '../../assets/images/contador.png';
import guardia from '../../assets/images/guardia.png';

export const LoginRol = ({ setRole }) => {
	const changeRol = (value) => {
		setRole(value);
	};

	return (
		<div className='LoginRol'>
			<h1>¿CUÁL ES TU CARGO?</h1>
			<div className='Rols'>
				{/*<SelectRol
					onClick={() => changeRol('asesor')}
					IconRol={asesor}
					Info='Soy un'
					RolName='Asesor'
	/>*/}
				<SelectRol
					onClick={() => changeRol('logistica')}
					IconRol={logistica}
					Info='Soy de'
					RolName='Logistica'
				/>
				<SelectRol
					onClick={() => changeRol('cajero')}
					IconRol={cajero}
					Info='Soy un'
					RolName='Cajero'
				/>
				<SelectRol
					onClick={() => changeRol('contador')}
					IconRol={contador}
					Info='Soy un'
					RolName='Contador'
				/>
				<SelectRol
					onClick={() => changeRol('administrador')}
					IconRol={guardia}
					Info='Soy un'
					RolName='Administrador'
				/>
			</div>
		</div>
	);
};
