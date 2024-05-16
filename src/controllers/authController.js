const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail} = require('../models/userModel');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Verificar si el usuario ya existe
        let user = await getUserByEmail(email);
        if (user) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear un nuevo usuario
        const result = await createUser(username, email, hashedPassword, role);

        if (result.success) {
            res.status(201).json({ message: 'Usuario creado exitosamente', user: result });
        } else {
            throw result.error;
        }
    } catch (err) {
        console.error('Error en register:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;

        // verificacion de si el usuario existe
        const user = await getUserByEmail(email);
        console.log(email, user);
        if (!user) {
            console.log("Usuario no existente");
            return res.status(400).json({ message: 'Ese usuarios no existe' })
        }

        // Comparación de contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({ message: 'Usearios o contraseña incorrectos' })
        }

        // generador de token JWT
        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token, user: { id: user.id, username: user.username, email: user.email} });
    }catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

exports.verifyToken = (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado', valid: false });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true });
    } catch (err) {
        // Check is instance of TokenExpiredError.
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado', valid: false });
        }
        // check if instance of JsonWebTokenError.
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token invalido', valid:false });
        }
        // check if instance of Error
        if (err instanceof Error) {
            return res.status(500).json({ message: 'Error en el servidor', valid: false });
        }
    }
}

exports.getAllUsers = async (res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error en getAllUsers:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};