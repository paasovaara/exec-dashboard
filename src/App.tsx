import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MatrixPage } from './pages/MatrixPage';
import { CosPage } from './pages/CosPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/matrix" replace />} />
        <Route path="matrix" element={<MatrixPage />} />
        <Route path="cos" element={<CosPage />} />
      </Route>
    </Routes>
  );
}

export default App;
