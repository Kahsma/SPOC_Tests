import { Client, StatusOK } from 'k6/net/grpc';
import { check, sleep } from 'k6';

const client = new Client();
client.load(['definitions'], 'Moving_Average_signal.proto');

// Cargar el archivo JSON en la fase de inicialización
const data = JSON.parse(open('../signal100K.json'));

export default () => {
    client.connect('localhost:8081', { plaintext: true });

    // Crear la solicitud usando los datos cargados
    const request = {
        signal: {
            values: data.values.map((complex) => ({ real: complex.real, imag: complex.imag }))
        },
        window_size: 3
    };

    const response = client.invoke('signal.SignalService/ComputeMovingAverage', request);

    check(response, {
        'status is OK': (r) => r && r.status === StatusOK,
    });

    console.log(JSON.stringify(response.message));

    client.close();
    sleep(1);
};
