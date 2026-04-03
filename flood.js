const net = require('net');

const HOST = '127.0.0.1';
const PORT = 8080;
const TOTAL_CONNECTIONS = 120;

let connected = 0;
let refused = 0;
let pending = 0;

for (let i = 0; i < TOTAL_CONNECTIONS; i++) {
    const socket = new net.Socket();
    const start = Date.now();

    socket.connect(PORT, HOST, () => {
        connected++;
        console.log(`[${i}] Connected after ${Date.now() - start}ms (total connected: ${connected})`);
    });

    socket.on('error', (err) => {
        refused++;
        const elapsed = Date.now() - start;
        console.log(`[${i}] ERROR after ${elapsed}ms: ${err.message} (total refused: ${refused})`);
    });

    socket.on('close', () => {
        pending--;
    });

    pending++;
}

setInterval(() => {
    console.log(`[pending] connected=${connected} refused=${refused} pending=${pending}`);
}, 1000);

setTimeout(() => {
    console.log('\n--- Results ---');
    console.log(`Connected : ${connected}`);
    console.log(`Refused   : ${refused}`);
    console.log(`Total sent: ${TOTAL_CONNECTIONS}`);
    process.exit(0);
}, 60000); // wait 60s so we can see the real timeout
