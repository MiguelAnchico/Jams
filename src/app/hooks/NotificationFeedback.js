import { useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export const useNotificationsFeedback = () => {
	const ActualizarEstado = (callBack, estado) => {
		Swal.fire({
			html:
				'¿Esta seguro que desea cambiarlo al estado de <b>' + estado + '</b>?',
			icon: 'question',
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				callBack(estado);
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const ActualizarPedido = (callBack, estado) => {
		Swal.fire({
			html:
				'¿Esta accion cambiara el pedido al estado de <b>' + estado + '</b>?',
			icon: 'warning',
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				callBack(estado);
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const ActualizarTipoPedido = (callBack) => {
		Swal.fire({
			title: 'Esta accion borrara todos los medios de pago',
			html: 'Para confirmar que quiere cambiar el tipo de pedido escriba: <b>Si</b>',
			icon: 'warning',
			input: 'text',
			inputAttributes: {
				autocapitalize: 'off',
			},
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
			preConfirm: (login) => {
				if (login.toLowerCase() == 'si') return;
				return Swal.showValidationMessage(`Mal Escrito`);
			},
		}).then((result) => {
			if (result.isConfirmed) {
				callBack(true);
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const PonerEnRevision = (callBack, estado) => {
		let html =
			estado == 1
				? '¿Esta seguro de pasar el pedido a <b> revision </b>?'
				: '¿Esta seguro de <b> terminar la revision </b>?';
		Swal.fire({
			html: html,
			icon: 'warning',
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				callBack(estado);
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const CambiarAfacturado = (callBack, data) => {
		Swal.fire({
			html: '¿Esta seguro que desea <b>Facturar</b> el pedido?',
			icon: 'warning',
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				callBack(data);
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const ReportarPagos = (callBack, nombre, medio, valor) => {
		Swal.fire({
			html: '¿Esta seguro que desea reportar el pago?',
			icon: 'warning',
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				callBack(nombre, medio, valor);
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const ReportarProducto = (callBack) => {
		Swal.fire({
			html: '¿Esta seguro que desea reportar el producto?',
			icon: 'warning',
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				callBack();
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const AgregarGuia = (callBack, data) => {
		Swal.fire({
			html: '¿Esta seguro que desea agregar la <b>guia</b>?',
			icon: 'question',
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				callBack(data);
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const notificarAgendado = (callBack, data) => {
		Swal.fire({
			html: '¿Esta seguro que desea ' + data + ' <b>agendado</b>?',
			icon: 'question',
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				callBack(data);
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const notificarAparcado = (callBack, data) => {
		Swal.fire({
			html: '¿Desea facturar un <b>Apartado</b>?',
			icon: 'question',
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				callBack(data);
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const MostrarPedido = (IdPedido) => {
		Swal.fire({
			html:
				'<p>Tu pedido ha sido creado con el codigo <b>' + IdPedido + '</b></p>',
			icon: 'success',
		}).then(() => {
			window.location.href = window.location.href;
		});
	};

	const errorDatos = (errorMesagge) => {
		Swal.fire({
			title: '¡Error!',
			text: errorMesagge,
			icon: 'error',
			confirmButtonText: 'Entendido',
		});
	};

	const ActualizarPago = (callBack, elemento, pago) => {
		Swal.fire({
			html: '¿Desea confirmar <b> el pago</b>?',
			icon: 'question',
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				callBack(elemento, pago);
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const pedidoActualizado = () => {
		Swal.fire({
			html: '<p>Pedido actualizado</p>',
			icon: 'success',
		}).then(() => {
			window.location.href = window.location.href;
		});
	};

	const cancelar = (callBack, data) => {
		Swal.fire({
			html: '¿Desea cancelar <b>' + data + ' </b>?',
			icon: 'question',
			showDenyButton: true,
			confirmButtonText: 'Si',
			denyButtonText: `No`,
		}).then((result) => {
			if (result.isConfirmed) {
				callBack();
			} /*else if (result.isDenied) {
				return false;
			}*/
		});
	};

	const agregarElemento = () =>
		toast.success('Se ha añadido exitosamente', {
			position: 'top-right',
			autoClose: 8000,
			style: {
				color: '#1F1B16',
				fontFamily: 'barlow',
				fontSize: '18px',
			},
		});
	const eliminarElemento = () =>
		toast.error('Se ha eliminado el elemento', {
			position: 'top-right',
			autoClose: 8000,
			style: {
				color: '#1F1B16',
				fontFamily: 'barlow',
				fontSize: '18px',
			},
		});
	const cambioExitoso = () =>
		toast.success('Se ha actualizado exitosamente', {
			position: 'top-right',
			autoClose: 8000,
			style: {
				color: '#1F1B16',
				fontFamily: 'barlow',
				fontSize: '18px',
			},
		});
	const cambioFracasado = () =>
		toast.error('No se ha logrado actualizar', {
			position: 'top-right',
			autoClose: 8000,
			style: {
				color: '#1F1B16',
				fontFamily: 'barlow',
				fontSize: '18px',
			},
		});

	return {
		ActualizarEstado,
		AgregarGuia,
		ActualizarPedido,
		PonerEnRevision,
		CambiarAfacturado,
		errorDatos,
		agregarElemento,
		eliminarElemento,
		cambioFracasado,
		cambioExitoso,
		MostrarPedido,
		ActualizarTipoPedido,
		ReportarPagos,
		ReportarProducto,
		pedidoActualizado,
		cancelar,
		notificarAgendado,
		notificarAparcado,
	};
};
