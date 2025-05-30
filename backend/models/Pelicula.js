import mongoose from 'mongoose';

const PeliculaSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    director: { type: String, required: true, trim: true },
    anio: { type: Number, required: true, min: 1800 },
    imagen: { type: String, default: null },
    review: { type: Number, min: 1, max: 5, default: 1 }, // Cambiado a número (estrellas)
});

export default mongoose.model('Pelicula', PeliculaSchema);
