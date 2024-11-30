import logger from '@/shared/logger.js';
import { AUTO, BLEND_SOURCE_OVER, read } from 'jimp';
import { toFile } from 'qrcode';

// URL de tu canal de YouTube
const youtubeChannelUrl = new URL(
	'@haytamouarid-k3k',
	'https://www.youtube.com/'
);

// Función principal
async function generateQRWithLogo() {
	try {
		// Generar el código QR como una imagen base
		const qrImagePath = 'out/qr.svg';
		await toFile(qrImagePath, youtubeChannelUrl.href, {
			type: 'svg',
			width: 500, // Asegúrate de que el tamaño sea suficiente para el logo
		});

		// Cargar el QR y el logo
		const qrImage = await read(qrImagePath);
		const logo = await read('assets/podsquad-logo.svg'); // Reemplaza con la ruta de tu logo

		// Redimensionar el logo para que encaje bien
		logo.resize(qrImage.bitmap.width / 5, AUTO); // El logo será un 20% del tamaño del QR

		// Combinar el logo con el QR
		const posX = (qrImage.bitmap.width - logo.bitmap.width) / 2;
		const posY = (qrImage.bitmap.height - logo.bitmap.height) / 2;
		qrImage.composite(logo, posX, posY, {
			mode: BLEND_SOURCE_OVER,
			opacitySource: 1,
		});

		// Guardar la imagen final
		await qrImage.writeAsync('out/qr_with_logo.svg');
		logger.info('¡Código QR con logo generado como qr_with_logo.svg!');
	} catch (err) {
		logger.error('Error generando el QR con logo:', err);
	}
}

generateQRWithLogo();
