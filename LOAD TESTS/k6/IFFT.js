import { Client, StatusOK } from 'k6/net/grpc';
import { check, sleep } from 'k6';

const client = new Client();
client.load(['definitions'], 'IFFT.proto');

// Cargar el archivo JSON durante la fase de inicialización
const data = JSON.parse(open('../signal100K.json')); // Asegúrate de que la ruta sea correcta

export default () => {
    client.connect('localhost:8081', { plaintext: true });

    // Crear la solicitud usando los datos cargados
    const request = {
        signal: {
            values: data.values.map((complex) => ({ real: complex.real, imag: complex.imag }))
        }
    };

    const response = client.invoke('signal.SignalService/ComputeIFFT', request);

    check(response, {
        'status is OK': (r) => r && r.status === StatusOK,
    });

    console.log(JSON.stringify(response.message));

    client.close();
    sleep(1);
};
