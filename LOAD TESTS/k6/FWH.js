import { Client, StatusOK } from 'k6/net/grpc';
import { check, sleep } from 'k6';

const client = new Client();
client.load(['definitions'], 'FastWaveletHaar.proto');

// Cargar el archivo JSON durante la fase de inicialización
const data = JSON.parse(open('../signal1K.json'));

export const options = {
    scenarios: {
        load_test: {
            executor: 'per-vu-iterations',
            vus: 10, // Start with 10 VUs
            iterations: 5, // Each VU runs a single iteration
            maxDuration: '30s', // Optional: limit the total duration of the test
        },
    },
};

export default () => {
    client.connect('', { plaintext: true });

    // Crear la solicitud usando los datos cargados y el nuevo formato
    const request = {
        signal: {
            values: data.values.map((complex) => ({ real: complex.real, imag: complex.imag }))
        }
    };

    const response = client.invoke('signal.SignalService/ComputeFastWaveletHaar', request);

    check(response, {
        'status is OK': (r) => r && r.status === StatusOK,
    });

    //console.log(JSON.stringify(response.message));

    client.close();
    sleep(1);
};
