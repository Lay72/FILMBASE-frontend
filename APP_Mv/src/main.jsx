import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/global.css';
import './styles/app.css';

import App from './App.jsx';
import PeliculasList from './components/PeliculasList.jsx';
import FormularioPelicula from './components/FormularioPelicula.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}>
                    <Route index element={<PeliculasList />} />
                    <Route path='nueva' element={<FormularioPelicula />} />
                    <Route path='editar/:id' element={<FormularioPelicula />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
