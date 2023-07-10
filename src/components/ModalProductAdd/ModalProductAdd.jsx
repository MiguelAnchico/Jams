import { useState } from 'react';

import { ModalInput } from './ModalInput/ModalInput';

import photoIcon from '../../assets/images/photo.png';
import cancelIcon from '../../assets/images/close.png';

import './ModalProductAdd.css';
import { useNotificationsFeedback } from '../../app/hooks/NotificationFeedback';

export const ModalProductAdd = ({ setProducts, products, recalcular }) => {
	const { errorDatos, agregarElemento } = useNotificationsFeedback();

	const [enable, setEnable] = useState(false);
	const [imgPreviewProduct, setImgPreviewProduct] = useState('');
	const [imgProduct, setImgProduct] = useState('');
	const [imgName, setImgName] = useState('');

	const [codigo, setCodigo] = useState('');
	const [nombre, setNombre] = useState('');
	const [medida, setMedida] = useState('');
	const [color, setColor] = useState('');
	const [precio, setPrecio] = useState('');
	const [cantidad, setCantidad] = useState('');

	const [errorCodigo, setErrorCodigo] = useState([]);
	const [errorNombre, setErrorNombre] = useState([]);
	const [errorMedida, setErrorMedida] = useState([]);
	const [errorColor, setErrorColor] = useState([]);
	const [errorPrecio, setErrorPrecio] = useState([]);
	const [errorCantidad, setErrorCantidad] = useState([]);

	const handleChange = (e) => {
		setImgPreviewProduct(URL.createObjectURL(e.target.files[0]));
		setImgProduct(e.target.files[0]);
		setImgName(e.target.files[0].name);
	};

	const handleAdd = (e) => {
		e.preventDefault();

		if (
			errorCodigo.length > 0 ||
			errorNombre.length > 0 ||
			errorMedida.length > 0 ||
			errorColor.length > 0 ||
			errorPrecio.length > 0 ||
			errorCantidad.length > 0 ||
			codigo == '' ||
			nombre == '' ||
			medida == '' ||
			color == '' ||
			precio == '' /*||
			cantidad == ''*/
		)
			return errorDatos('Debe de completar todos los campos');

		if (!imgProduct) return errorDatos('Debe de subir una imagen del producto');

		let codigoP = codigo.replaceAll('/', '-');
		let nombreP = nombre.replaceAll('/', '-');
		let medidaP = medida.replaceAll('/', '-');
		let colorP = color.replaceAll('/', '-');

		codigoP = codigoP.replaceAll('%', '-');
		nombreP = nombreP.replaceAll('%', '-');
		medidaP = medidaP.replaceAll('%', '-');
		colorP = colorP.replaceAll('%', '-');

		codigoP = codigoP.replaceAll('?', '-');
		nombreP = nombreP.replaceAll('?', '-');
		medidaP = medidaP.replaceAll('?', '-');
		colorP = colorP.replaceAll('?', '-');

		let arrayProducts = [
			...products,
			{
				codigo: codigoP,
				nombre: nombreP,
				medida: medidaP,
				color: colorP,
				precio,
				cantidad: 1,
				imgProduct,
				imgPreviewProduct,
			},
		];
		setProducts(arrayProducts);
		agregarElemento();
		recalcular(arrayProducts);
		setCodigo('');
		setNombre('');
		setMedida('');
		setColor('');
		setPrecio('');
		setCantidad('');
		setImgProduct('');
		setImgPreviewProduct('');
		setImgName('');
		setEnable(false);
	};

	return (
		<div className='ModalProductAdd'>
			<div className='Modal' style={enable ? {} : { display: 'none' }}>
				<div className='ModalContent'>
					<div className='ModalContentInput'>
						<img
							src={cancelIcon}
							onClick={(e) => setEnable(false)}
							className='IconClose'
						/>
						<h2>Agregar un producto</h2>
						<p className='bodySmall'>
							Añade la imagen, código y valor del producto
						</p>

						<div>
							<div className='ModalContentUpload'>
								<img src={photoIcon} onClick={(e) => setEnable(false)} />
								<h3>ARRASTRA Y SUELTA</h3>
								<p className='bodyMedium'>la imagen del producto</p>
								<p className='bodySmall OP4'>
									Máximo de 50 MB. Formato JPG, PNG y JPNG
								</p>
								<input
									name='foto'
									onChange={handleChange}
									type='file'
									accept='.jpg, .jpeg, .png'
								/>
							</div>
							<div className='ModelContentPreview'>
								<img src={imgPreviewProduct} alt='' />
								<p className='bodySmall'>{imgName ? 'Cargado' : ''}</p>
							</div>
							<div className='FormOrder-MultipleInput'>
								<ModalInput
									label={'Codigo*'}
									type={'text'}
									placeHolder={'Codigo'}
									required={true}
									min={2}
									max={40}
									setError={setErrorCodigo}
									error={errorCodigo}
									setValue={setCodigo}
									value={codigo}
								/>
								<ModalInput
									label={'Nombre*'}
									type={'text'}
									placeHolder={'Nombre'}
									required={true}
									min={5}
									max={100}
									setError={setErrorNombre}
									error={errorNombre}
									setValue={setNombre}
									value={nombre}
								/>
							</div>
							<div className='FormOrder-TripleInput'>
								<ModalInput
									label={'Medida*'}
									type={'text'}
									placeHolder={'Medida'}
									required={true}
									min={1}
									max={50}
									setError={setErrorMedida}
									error={errorMedida}
									setValue={setMedida}
									value={medida}
								/>
								<ModalInput
									label={'Color*'}
									type={'text'}
									placeHolder={'Color'}
									required={true}
									min={3}
									max={50}
									setError={setErrorColor}
									error={errorColor}
									setValue={setColor}
									value={color}
								/>
							</div>
							<ModalInput
								label={'Precio*'}
								type={'number'}
								placeHolder={'Precio'}
								required={true}
								min={5}
								max={3000000}
								setError={setErrorPrecio}
								error={errorPrecio}
								setValue={setPrecio}
								value={precio}
							/>
							<div className='FormOrder-MultipleInput-left'>
								{/*<ModalInput
									label={'Cantidad*'}
									type={'number'}
									placeHolder={'Cantidad'}
									required={true}
									min={1}
									max={5}
									setError={setErrorCantidad}
									error={errorCantidad}
									setValue={setCantidad}
									value={cantidad}
								/>*/}
							</div>
							<button className='labelMedium' onClick={handleAdd}>
								Agregar
							</button>
						</div>
					</div>
				</div>
				<div
					className='ModalBackground'
					onClick={(e) => setEnable(false)}
				></div>
			</div>
			<div onClick={(e) => setEnable(true)} className='BoxProductAdd'>
				+
			</div>
		</div>
	);
};
