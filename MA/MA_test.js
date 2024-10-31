import { Client, StatusOK } from 'k6/net/grpc';
import { check, sleep } from 'k6';

const client = new Client();
client.load(['definitions'], 'Moving_Average_signal.proto');

export default () => {
    client.connect('localhost:10000', { plaintext: true });  // Use plaintext if server doesn't require TLS

    const data = JSON.parse(open('signal.json'));

    // Ensure the request matches the structure of MovingAverageRequest
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