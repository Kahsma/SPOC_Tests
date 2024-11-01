import { Client, StatusOK } from 'k6/net/grpc';
import { check, sleep } from 'k6';

const client = new Client();
client.load(['definitions'], 'FFT_Convolve.proto');

// Cargar el archivo JSON durante la fase de inicialización
const dataX = JSON.parse(open('../signalX.json')); // Cambia la ruta según corresponda
const dataH = JSON.parse(open('../signalH.json')); // Cambia la ruta según corresponda

export default () => {
    client.connect('localhost:8081', { plaintext: true });

    // Crear la solicitud usando los datos cargados
    const request = {
        signalx: {
            values: dataX.values.map((complex) => ({ real: complex.real, imag: complex.imag }))
        },
        signalh: {
            values: dataH.values.map((complex) => ({ real: complex.real, imag: complex.imag }))
        },
        shift: false, // Cambia a true si necesitas aplicar el desplazamiento
    };

    const response = client.invoke('signal.SignalService/ComputeFftConvolve', request);

    check(response, {
        'status is OK': (r) => r && r.status === StatusOK,
    });

    console.log(JSON.stringify(response.message));

    client.close();
    sleep(1);
};
