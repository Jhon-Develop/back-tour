const Tour = require('../models/tourModel');
const jwt = require('jsonwebtoken');

exports.createTour = async (req, res) => {
    try {
        const { name, description, city, available, price, rating, date, capacity, category_name } = req.body;
        const token = req.header('Authorization')?.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id;

        if (!name || !description || !city || available === undefined || price === undefined || !rating || !date || capacity === undefined || !category_name || !userId) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const categoryResult = await Tour.ensureCategoryExists(category_name);

        if (!categoryResult.success) {
            return res.status(500).json({ message: 'Error al crear o validar la categoría del tour', error: categoryResult.error });
        }

        const tourCategoryId = categoryResult.categoryId;

        const result = await Tour.createTour(name, description, city, available, price, rating, date, capacity, userId, tourCategoryId);

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
        const { name, description, city, available, price, rating, date, capacity, category_name } = req.body;

        if (!name && !description && !city && available === undefined && price === undefined && !rating && !date && capacity === undefined && !category_name) {
            return res.status(400).json({ message: 'Al menos un campo es obligatorio para actualizar' });
        }

        let tourCategoryId = null;
        if (category_name) {
            const categoryResult = await Tour.ensureCategoryExists(category_name);

            if (!categoryResult.success) {
                return res.status(500).json({ message: 'Error al crear o validar la categoría del tour', error: categoryResult.error });
            }

            tourCategoryId = categoryResult.categoryId;
        }

        const updatedData = {
            name,
            description,
            city,
            available,
            price,
            rating,
            date,
            capacity,
            tour_category_id: tourCategoryId // Asegurarse de que usamos el nombre correcto
        };

        // Filtrar campos undefined
        Object.keys(updatedData).forEach(key => {
            if (updatedData[key] === undefined || updatedData[key] === null) {
                delete updatedData[key];
            }
        });

        const result = await Tour.updateTour(req.params.id, updatedData);

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
exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.getAllTours();
        res.json(tours);
    } catch (error) {
        console.error('Error al obtener todos los tours:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
