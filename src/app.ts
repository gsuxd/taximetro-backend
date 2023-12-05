import express from 'express';
import compression from 'compression';
import config from './config';
import authRouter from './routes/auth.routes';
import testRouter from './routes/test.routes';

const app = express();

app.set('port', config.PORT || 3000);
app.use(compression());
app.use(express.static('public'));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use((req: any, res: any, next: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.get('/raiz', (req, res) => {
    res.send('200');
});

app.use('/api/auth', authRouter);

// Test
app.use('/api/tester', testRouter);

export default app;