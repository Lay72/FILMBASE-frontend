import express from 'express';
import mongoose from 'mongoose';
import Pelicula from '../models/Pelicula.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// === Configuración de almacenamiento de imágenes ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Servir imágenes desde /movies/uploads
router.use('/uploads', express.static('uploads'));

/**
 * @route   GET /movies/
 * @desc    Obtener todas las películas
 * @returns {Array} Lista de películas en formato JSON
 * @errors  500 - Error interno del servidor al obtener películas
 */
router.get('/', async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        res.status(200).json(peliculas);
    } catch (error) {
        console.error('Error al obtener películas:', error);
        res.status(500).json({ error: 'Error al obtener películas' });
    }
});

/**
 * @route   GET /movies/:id
 * @desc    Obtener una película por su ID
 * @param   {string} id - ID de la película (en la URL)
 * @returns {Object} Objeto película en formato JSON
 * @errors  400 - ID inválido
 *          404 - Película no encontrada
 *          500 - Error interno del servidor
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const pelicula = await Pelicula.findById(id);
        if (!pelicula) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        res.status(200).json(pelicula);
    } catch (error) {
        console.error('Error al obtener película:', error);
        res.status(500).json({ error: 'Error al obtener película' });
    }
});

/**
 * @route   POST /movies/
 * @desc    Crear una nueva película
 * @body    { string } titulo - Título de la película (requerido)
 *          { string } director - Director de la película (requerido)
 *          { number } anio - Año de lanzamiento (requerido)
 *          { number } review - Calificación (1-5, opcional, default 1)
 *          { file } imagen - Imagen de la película (opcional, multipart/form-data)
 * @returns {Object} Objeto de la película creada
 * @errors  400 - Campos requeridos faltantes
 *          500 - Error interno al crear película
 */
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const { titulo, director, anio, review } = req.body;

        if (!titulo || !director || !anio) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const nuevaPelicula = new Pelicula({
            titulo,
            director,
            anio: Number(anio),
            review: review ? Number(review) : 1,
            imagen: req.file ? req.file.filename : null,
        });

        await nuevaPelicula.save();
        res.status(201).json(nuevaPelicula);
    } catch (error) {
        console.error('Error al crear película:', error);
        res.status(500).json({ error: 'Error al crear película' });
    }
});

/**
 * @route   PUT /movies/:id
 * @desc    Actualizar una película existente
 * @param   {string} id - ID de la película (en la URL)
 * @body    { string } titulo - Nuevo título (requerido)
 *          { string } director - Nuevo director (requerido)
 *          { number } anio - Nuevo año (requerido)
 *          { number } review - Nueva calificación (opcional, default 1)
 *          { file } imagen - Nueva imagen (opcional, multipart/form-data)
 * @returns {Object} Objeto de la película actualizada
 * @errors  400 - ID inválido o campos requeridos faltantes
 *          404 - Película no encontrada
 *          500 - Error interno al actualizar película
 */
router.put('/:id', upload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { titulo, director, anio, review } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    if (!titulo || !director || !anio) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    try {
        const updateData = {
            titulo,
            director,
            anio: Number(anio),
            review: review ? Number(review) : 1,
        };

        if (req.file) {
            updateData.imagen = req.file.filename;
        }

        const peliculaActualizada = await Pelicula.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!peliculaActualizada) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        res.status(200).json(peliculaActualizada);
    } catch (error) {
        console.error('Error al actualizar película:', error);
        res.status(500).json({ error: 'Error al actualizar película' });
    }
});

/**
 * @route   DELETE /movies/:id
 * @desc    Eliminar una película por ID
 * @param   {string} id - ID de la película (en la URL)
 * @returns {Object} Mensaje de éxito
 * @errors  400 - ID inválido
 *          404 - Película no encontrada
 *          500 - Error interno al eliminar película
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        const peliculaEliminada = await Pelicula.findByIdAndDelete(id);
        if (!peliculaEliminada) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        // Eliminar imagen asociada si existe
        if (peliculaEliminada.imagen) {
            const imagePath = path.join('uploads', peliculaEliminada.imagen);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({ message: 'Película eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar película:', error);
        res.status(500).json({ error: 'Error al eliminar película' });
    }
});

export default router;
