const origenes_permitidos = [
    "http://localhost:5000",
    "http://localhost:3000",
    "undefined"
];

const corsConfig = {
    origin: origenes_permitidos,
    credentials: true
}

module.exports = corsConfig;