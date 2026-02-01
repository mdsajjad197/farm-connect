
import http from 'http';
import fs from 'fs';

const email = `testconsumer${Date.now()}@example.com`;
const password = 'password123';
const phone = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;

const signupData = JSON.stringify({
    name: 'Mobile Test Consumer',
    email: email,
    password: password,
    phone: phone,
    address: '123 Farm Lane',
    city: 'Farmville'
});

const signupOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/consumer/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': signupData.length
    }
};

console.log('Signing up with', email);

const signupReq = http.request(signupOptions, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Signup Response:', body);
        performLogin();
    });
});

signupReq.write(signupData);
signupReq.end();

function performLogin() {
    const loginData = JSON.stringify({
        email: email,
        password: password
    });

    const loginOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/consumer/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': loginData.length
        }
    };

    const loginReq = http.request(loginOptions, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(body);
                if (json.token) {
                    console.log('Got token');
                    fs.writeFileSync('token.txt', json.token);
                }
                else console.log('NO_TOKEN', body);
            } catch (e) {
                console.log('Login Response Body:', body);
            }
        });
    });

    loginReq.write(loginData);
    loginReq.end();
}
