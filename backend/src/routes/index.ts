import { Router } from 'express';
import * as ShowController from '../controllers/showController';
import * as BookingController from '../controllers/bookingController';

const router = Router();

/**
 * @swagger
 * /api/shows:
 *   post:
 *     summary: Create a new show (Admin)
 */
router.post('/admin/shows', ShowController.createShow);

/**
 * @swagger
 * /api/shows:
 *   get:
 *     summary: Get all shows
 */
router.get('/public/shows', ShowController.getShows);

/**
 * @swagger
 * /api/shows/{id}:
 *   get:
 *     summary: Get show details with seats
 */
router.get('/public/shows/:id', ShowController.getShowById);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Book seats
 */
router.post('/public/bookings', BookingController.bookSeats);
router.get('/public/bookings/user/:userId', BookingController.getUserBookings);

export default router;
