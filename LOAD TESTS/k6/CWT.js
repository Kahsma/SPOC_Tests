import { Client, StatusOK } from 'k6/net/grpc';
import { check, sleep } from 'k6';

const client = new Client();
client.load(['definitions'], 'signal_CWT.proto');

// Load JSON file during the initialization phase
const data = JSON.parse(open('../signal10K.json'));

export default () => {
    client.connect('localhost:8081', { plaintext: true });

    // Create the request using the loaded data
    const request = {
        signal: {
            values: data.values.map((complex) => ({ real: complex.real, imag: complex.imag }))
        },
        start: 1.0,
        end: 1000.0,
        numScales: 10
    };

    const response = client.invoke('signal.SignalService/ComputeCWT', request);

    check(response, {
        'status is OK': (r) => r && r.status === StatusOK,
    });

    console.log(JSON.stringify(response.message));

    client.close();
    sleep(1);
};
