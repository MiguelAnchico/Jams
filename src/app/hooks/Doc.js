import {
	Document,
	Paragraph,
	TextRun,
	AlignmentType,
	Packer,
	ImageRun,
	HorizontalPositionAlign,
} from 'docx';
import { saveAs } from 'file-saver';
import Logo from '../../assets/images/logo.webp';

export const generateWordDocument = async (
	nombre,
	cedula,
	direccion,
	departamento,
	ciudad,
	celular
) => {
	const font1 = 'Bahnschrift Light Condensed';
	const font2 = 'Calibri';
	let logo = await fetch(Logo);
	logo = await logo.blob();
	const paragraph1 = new Paragraph({
		children: [
			new TextRun({ text: 'ENVIA', font: font1, size: 48, bold: true }),
			new TextRun({
				text: 'IMPOACCESORIOS DE COLOMBIA SAS',
				bold: true,
				size: 48,
				font: font1,
				break: 1,
			}),
			new TextRun({ text: 'NIT.901.358.454', font: font2, size: 48, break: 1 }),
			new TextRun({
				text: 'CALLE 15 # 15 - 16',
				font: font2,
				size: 48,
				break: 1,
			}),
			new TextRun({ text: 'TEL.3753664', font: font2, size: 48, break: 1 }),
			new TextRun({ text: 'CEL. 3128554603', font: font2, size: 48, break: 1 }),
			new ImageRun({
				data: logo,
				transformation: {
					width: 380,
					height: 380,
				},
				floating: {
					horizontalPosition: {
						align: HorizontalPositionAlign.RIGHT,
						offset: 1014,
					},
					verticalPosition: {
						offset: 10000,
					},
				},
			}),
		],
	});
	const paragraph2 = new Paragraph({
		alignment: AlignmentType.RIGHT,
		children: [
			new TextRun({
				text: 'RECIBE',
				font: font1,
				size: 60,
				bold: true,
				break: 1,
			}),
			new TextRun({
				text: nombre,
				size: 60,
				font: font1,
				break: 1,
			}),
			new TextRun({
				text: cedula,
				font: font2,
				size: 60,
				break: 1,
			}),
			new TextRun({
				text: direccion,
				font: font2,
				size: 60,
				break: 1,
			}),
			new TextRun({
				text: departamento + ' - ' + ciudad,
				font: font2,
				size: 60,
				break: 1,
			}),
			new TextRun({
				text: celular,
				font: font2,
				size: 60,
				break: 1,
			}),
		],
	});
	let doc = new Document({
		sections: [
			{
				children: [paragraph1, paragraph2],
			},
		],
	});
	Packer.toBlob(doc).then((blob) => {
		// saveAs from FileSaver will download the file
		saveAs(blob, 'report.docx');
	});
};
