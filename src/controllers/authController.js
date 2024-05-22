const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, getRoleByName, updateUser } = require('../models/userModel');

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Verificar si el usuario ya existe
        let user = await getUserByEmail(email);
        if (user) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Verificar si el rol existe
        const roleData = await getRoleByName(role);
        if (!roleData) {
            return res.status(400).json({ message: 'Rol no existente' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear un nuevo usuario
        const result = await createUser(username, email, hashedPassword, roleData.role_id);

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
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Ese usuario no existe' });
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token, user: { id: user.user_id, username: user.username, email: user.email } });
    } catch (err) {
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
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado', valid: false });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido', valid: false });
        }
        if (err instanceof Error) {
            return res.status(500).json({ message: 'Error en el servidor', valid: false });
        }
    }
};

exports.getAllUsers = async (res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error en getAllUsers:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar un usuario por ID
exports.updateUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const { userId } = req.params;

        let updatedData = {};

        // Verificar si el usuario existe
        let user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Ese usuario no existe' });
        }

        // Verificar si el rol existe
        if (role) {
            const roleData = await getRoleByName(role);
            if (!roleData) {
                return res.status(400).json({ message: 'Rol no existente' });
            }
            updatedData.role_id = roleData.role_id;
        }

        // Encriptar la contraseña si se proporciona
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updatedData.password = hashedPassword;
        }

        // Añadir campos actualizables al objeto updatedData
        if (username) updatedData.username = username;
        if (email) updatedData.email = email;

        // Actualizar el usuario
        const result = await updateUser(userId, updatedData);

        if (result.success) {
            res.status(200).json({ message: 'Usuario actualizado exitosamente' });
        } else {
            throw result.error;
        }
    } catch (err) {
        console.error('Error en updateUser:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
