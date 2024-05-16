const Tour = require('../models/tourModel');

// Crear un nuevo tour
exports.createTour = async (req, res) => {
    try {
        const { capacity, title, price, description, city, rating, availability } = req.body;
        const userId = req.user.id; // ID del usuario autenticado
        
        const result = await Tour.createTour(capacity, title, price, description, city, rating, availability, userId);

        if (result.success) {
            res.status(201).json({ message: 'Tour creado exitosamente', tourId: result.tourId });
        } else {
            res.status(500).json({ message: 'Error al crear tour', error: result.error });
        }
    } catch (error) {
        console.error('Error al crear tour:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener un tour por ID
exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.getTourById(req.params.id);
        if (!tour) {
            return res.status(404).json({ message: 'Tour no encontrado' });
        }
        res.json(tour);
    } catch (error) {
        console.error('Error al obtener tour por ID:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar un tour por ID
exports.updateTour = async (req, res) => {
    try {
        const { capacity, title, price, description, city, rating, availability } = req.body;
        
        const result = await Tour.updateTour(req.params.id, {
            capacity,
            title,
            price,
            description,
            city,
            rating,
            availability
        });

        if (!result.success) {
            return res.status(404).json({ message: 'Tour no encontrado' });
        }

        res.json({ message: 'Tour actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar tour por ID:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar un tour por ID
exports.deleteTour = async (req, res) => {
    try {
        const result = await Tour.deleteTour(req.params.id);

        if (!result.success) {
            return res.status(404).json({ message: 'Tour no encontrado' });
        }

        res.json({ message: 'Tour eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tour por ID:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener todos los tours
exports.getAllTours = async (res) => {
    try {
        const tours = await Tour.getAllTours();
        res.json(tours);
    } catch (error) {
        console.error('Error al obtener todos los tours:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
