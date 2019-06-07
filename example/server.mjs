import path from 'path';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

app.use(express.static(path.resolve('./example')));

const port = process.env.PORT || 3000;
server.listen(port);
