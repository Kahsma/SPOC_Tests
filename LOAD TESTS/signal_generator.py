import json
import random

class Complex:
    def __init__(self, real, imag):
        self.real = real
        self.imag = imag

    def to_dict(self):
        return {
            'real': self.real,
            'imag': self.imag
        }

class SignalGrpc:
    def __init__(self):
        self.values = []

    def add_value(self, complex_value):
        self.values.append(complex_value)

    def to_dict(self):
        return {
            'values': [value.to_dict() for value in self.values]
        }

def generate_signal(num_values):
    signal = SignalGrpc()
    for _ in range(num_values):
        real = random.uniform(-1.0, 1.0)
        imag = random.uniform(-1.0, 1.0)
        complex_value = Complex(real, imag)
        signal.add_value(complex_value)
    return signal

def save_signal_to_json(signal, filename):
    with open(filename, 'w') as f:
        json.dump(signal.to_dict(), f, indent=4)

if __name__ == "__main__":
    num_values = 100  # Number of complex values to generate
    signal = generate_signal(num_values)
    save_signal_to_json(signal, 'signal.json')
    print('Signal saved to signal.json')