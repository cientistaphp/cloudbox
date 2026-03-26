import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from './pages/Main';
import Box from './pages/Box';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" exact element={<Main />} />
      <Route path="/box/:id" element={<Box />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
