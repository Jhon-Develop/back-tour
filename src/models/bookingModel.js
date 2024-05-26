const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

exports.createBooking = async (user_id, tour_id, paymentData) => {
    const { value, quota, card_number, cvc, request_payment, date } = paymentData;
    
    try {
        // Encriptar el card_number y cvc
        const hashedCardNumber = await bcrypt.hash(card_number, 10);
        const hashedCVC = await bcrypt.hash(cvc, 10);

        // Iniciar una transacción
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Asegúrate de que el tour_id existe
            // const [tourCheck] = await connection.execute(`
            //     SELECT tour_id FROM tours WHERE id = ?
            // `, [tour_id]);

            // if (tourCheck.length === 0) {
            //     throw new Error(`El tour_id ${tour_id} no existe.`);
            // }

            // Insertar en la tabla payments
            const [paymentResult] = await connection.execute(`
                INSERT INTO payments (value, quota, card_number, cvc, request_payment, date)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [value, quota, hashedCardNumber, hashedCVC, request_payment, date]);

            const payment_id = paymentResult.insertId;

            // Insertar en la tabla bookings
            const [bookingResult] = await connection.execute(`
                INSERT INTO bookings (user_id, tour_id, payment_id, created_at)
                VALUES (?, ?, ?, NOW())
            `, [user_id, tour_id, payment_id]);

            await connection.commit();

            return { success: true, bookingId: bookingResult.insertId, paymentId: payment_id };
        } catch (error) {
            await connection.rollback();
            console.error('Error al crear la reserva y el pago:', error);
            return { success: false, error };
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error en la transacción de la reserva:', error);
        return { success: false, error };
    }
};

// Obtener un pago por ID
exports.getPaymentById = async (payment_id) => {
    try {
        const [rows] = await pool.execute(`
            SELECT * FROM payments WHERE payment_id = ?
        `, [payment_id]);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error('Error al obtener pago por ID:', error);
        throw error;
    }
};

// Obtener todos los pagos
exports.getAllPayments = async () => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM payments
        `);

        return rows;
    } catch (error) {
        console.error('Error al obtener todos los pagos:', error);
        throw error;
    }
};

// Actualizar un pago
exports.updatePayment = async (payment_id, value, quota, card_number, cvc, request_payment, date) => {
    try {
        const cleanedCardNumber = card_number.replace(/-/g, '');
        const hashedCardNumber = await bcrypt.hash(cleanedCardNumber, 10);
        const hashedCVC = await bcrypt.hash(cvc, 10);

        const [result] = await pool.execute(`
            UPDATE payments 
            SET value = ?, quota = ?, card_number = ?, cvc = ?, request_payment = ?, date = ?
            WHERE payment_id = ?
        `, [value, quota, hashedCardNumber, hashedCVC, request_payment, date, payment_id]);

        return { success: true };
    } catch (error) {
        console.error('Error al actualizar pago:', error);
        return { success: false, error };
    }
};

// Eliminar un pago
exports.deletePayment = async (payment_id) => {
    try {
        await pool.execute(`
            DELETE FROM payments WHERE payment_id = ?
        `, [payment_id]);

        return { success: true };
    } catch (error) {
        console.error('Error al eliminar pago:', error);
        return { success: false, error };
    }
};

// Obtener todas las reservas
exports.getAllBookings = async () => {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM bookings
        `);

        return rows;
    } catch (error) {
        console.error('Error al obtener todas las reservas:', error);
        throw error;
    }
};