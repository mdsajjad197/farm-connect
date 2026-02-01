
const http = require('http');

const data = JSON.stringify({
    name: 'Mobile Test Consumer',
    email: `testconsumer${Date.now()}@example.com`,
    password: 'password123',
    phone: '1234567890',
    address: '123 Farm Lane',
    city: 'Farmville'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/consumer/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Response:', body);
    });
});

req.on('error', (error) => {
    console.error("Error:", error);
});

req.write(data);
req.end();
