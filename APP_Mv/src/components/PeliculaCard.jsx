import React from 'react';
import { useNavigate } from 'react-router-dom';

// Componente para mostrar estrellas según calificación
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

export default function PeliculaCard({ pelicula, onEliminar }) {
    const navigate = useNavigate();
    const { _id, titulo, director, anio, imagen, review } = pelicula;

    return (
        <div className='pelicula-card'>
            {imagen ? (
                <img src={imagen} alt={titulo} />
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '330px',
                        backgroundColor: '#444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#aaa',
                        fontSize: '1rem',
                    }}>
                    Sin imagen
                </div>
            )}
            <div className='contenido'>
                <h3>{titulo}</h3>
                <p>
                    <strong>Director:</strong> {director}
                </p>
                <p>
                    <strong>Año:</strong> {anio}
                </p>
                {typeof review === 'number' && (
                    <div>
                        <strong>Calificación:</strong>{' '}
                        <Estrellas valor={review} />
                    </div>
                )}
                <div className='acciones'>
                    <button
                        className='boton-amarillo'
                        onClick={() => navigate(`/editar/${_id}`)}>
                        Editar
                    </button>
                    <button
                        className='boton-amarillo'
                        onClick={() => onEliminar(_id)}>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}
