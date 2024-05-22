const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

// Crear una reserva y el pago correspondiente
exports.createBooking = async (user_id, tour_id, paymentData) => {
    const { value, quota, card_number, cvc, request_payment, date } = paymentData;

    try {
        // Eliminar guiones del número de tarjeta antes de encriptar
        const cleanedCardNumber = card_number.replace(/-/g, '');
        const hashedCardNumber = await bcrypt.hash(cleanedCardNumber, 10);
        const hashedCVC = await bcrypt.hash(cvc, 10);

        // Iniciar una transacción
        await pool.getConnection(async (conn) => {
            await conn.beginTransaction();

            try {
                // Insertar en la tabla payments
                const [paymentResult] = await conn.execute(`
                    INSERT INTO payments (value, quota, card_number, cvc, request_payment, date)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [value, quota, hashedCardNumber, hashedCVC, request_payment, date]);

                const payment_id = paymentResult.insertId;

                // Insertar en la tabla bookings
                const [bookingResult] = await conn.execute(`
                    INSERT INTO bookings (user_id, tour_id, payment_id, created_at)
                    VALUES (?, ?, ?, NOW())
                `, [user_id, tour_id, payment_id]);

                // Confirmar la transacción
                await conn.commit();

                return { success: true, bookingId: bookingResult.insertId, paymentId: payment_id };
            } catch (error) {
                await conn.rollback();
                console.error('Error al crear la reserva y el pago:', error);
                return { success: false, error };
            } finally {
                conn.release();
            }
        });
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
