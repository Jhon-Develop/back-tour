const bcrypt = require('bcryptjs');

const encryptCardNumber = async (card_number) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedCard_number = await bcrypt.hash(card_number, salt);
        console.log('Hashed Card Number:', hashedCard_number);
        return hashedCard_number;
    } catch (error) {
        console.error('Error al encriptar el número de tarjeta:', error);
        throw error;
    }
};

encryptCardNumber(card_number);