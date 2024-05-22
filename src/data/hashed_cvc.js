const bcrypt = require('bcryptjs');

const encryptCVC = async (cvc) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedCVC = await bcrypt.hash(cvc, salt);
        console.log('Hashed CVC:', hashedCVC);
        return hashedCVC;
    } catch (error) {
        console.error('Error al encriptar el CVC:', error);
        throw error;
    }
};

// Llamada a la función con el código CVC
encryptCVC(cvc);
