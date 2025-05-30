import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PeliculaCard from './PeliculaCard';

const BACKEND_URL = 'https://filmbase-frontend.onrender.com';
const API_URL = `${BACKEND_URL}/movies`;

// Función para renderizar estrellas según la calificación (0 a 5)
function Estrellas({ valor }) {
    const maxEstrellas = 5;
    const estrellas = [];

    for (let i = 1; i <= maxEstrellas; i++) {
        estrellas.push(
            <span
                key={i}
                style={{
                    color: i <= valor ? '#f5c518' : '#ccc',
                    fontSize: '1.2rem',
                }}>
                ★
            </span>
        );
    }
    return <div>{estrellas}</div>;
}

export default function PeliculasList() {
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar películas del backend
    const cargarPeliculas = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            setPeliculas(res.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar películas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPeliculas();
    }, []);

    // Eliminar película por id
    const eliminarPelicula = async (id) => {
        if (!window.confirm('¿Seguro que quieres eliminar esta película?'))
            return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            cargarPeliculas();
        } catch {
            alert('Error al eliminar la película');
        }
    };

    if (loading) return <p>Cargando películas...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='container'>
            <h2>Películas disponibles</h2>
            {peliculas.length === 0 ? (
                <p>No hay películas disponibles.</p>
            ) : (
                <div className='lista-peliculas'>
                    {peliculas.map((pelicula) => (
                        <PeliculaCard
                            key={pelicula._id}
                            pelicula={{
                                ...pelicula,
                                imagen: pelicula.imagen
                                    ? `${BACKEND_URL}/uploads/${pelicula.imagen}`
                                    : null,
                            }}
                            onEliminar={eliminarPelicula}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
