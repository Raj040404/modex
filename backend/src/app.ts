import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import logger from './utils/logger';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger Spec
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Booking System API',
            version: '1.0.0',
            description: 'API for Booking System (Shows, Seats, Bookings)',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get(['/health', '/healthz'], (req, res) => {
    res.status(200).json({ status: 'UP' });
});

import routes from './routes';

// Routes
app.use('/api', routes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
