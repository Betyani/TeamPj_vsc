import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function ProjectRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <TopAppBarPlus />
    </BrowserRouter>
  );
}