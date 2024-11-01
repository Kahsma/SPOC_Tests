import { Client, StatusOK } from 'k6/net/grpc';
import { check, sleep } from 'k6';

const client = new Client();
client.load(['definitions'], 'FastWaveletTransform.proto');

// Cargar el archivo JSON durante la fase de inicialización
const data = JSON.parse(open('../signal100K.json')); // Asegúrate de que la ruta sea correcta

export default () => {
    client.connect('localhost:8081', { plaintext: true });

    // Crear la solicitud usando los datos cargados
    const request = {
        signal: {
            values: data.values.map((complex) => ({ real: complex.real, imag: complex.imag }))
        },
        dec_level: 3,
        wave_name: 'db1'
    };

    const response = client.invoke('signal.SignalService/ComputeFastWaveletTransform', request);

    check(response, {
        'status is OK': (r) => r && r.status === StatusOK,
    });

    console.log(JSON.stringify(response.message));

    client.close();
    sleep(1);
};
