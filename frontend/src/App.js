import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import './App.css';
import VirtualMachinePage from './pages/VirtualMachinePage';
import KubernetesClusterPage from './pages/KubernetesClusterPage';
import TemplateListPage from './pages/TemplateListPage';
import VirtualMachineListPage from './pages/VirtualMachineListPage';
import KubernetesClusterListPage from './pages/KubernetesClusterListPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>PaaS Provider</h1>
          <nav>
            <div className="nav-section">
              <h3>Создание</h3>
              <ul>
                <li>
                  <NavLink to="/vm/create" className={({ isActive }) => isActive ? "active" : ""}>
                    Виртуальная Машина
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/kubernetes/create" className={({ isActive }) => isActive ? "active" : ""}>
                    Kubernetes Кластер
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/templates/create" className={({ isActive }) => isActive ? "active" : ""}>
                    Шаблон
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="nav-section">
              <h3>Управление</h3>
              <ul>
                <li>
                  <NavLink to="/vm/list" className={({ isActive }) => isActive ? "active" : ""}>
                    Виртуальные Машины
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/kubernetes/list" className={({ isActive }) => isActive ? "active" : ""}>
                    Kubernetes Кластеры
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/templates/list" className={({ isActive }) => isActive ? "active" : ""}>
                    Шаблоны
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<div className="welcome">Выберите раздел в меню</div>} />

            {/* Creation routes */}
            <Route path="/vm/create" element={<VirtualMachinePage />} />
            <Route path="/kubernetes/create" element={<KubernetesClusterPage />} />
            <Route path="/templates/create" element={<Navigate to="/templates/list" replace />} />

            {/* Management routes */}
            <Route path="/vm/list" element={<VirtualMachineListPage />} />
            <Route path="/kubernetes/list" element={<KubernetesClusterListPage />} />
            <Route path="/templates/list" element={<TemplateListPage />} />

            {/* Redirect old routes */}
            <Route path="/vm" element={<Navigate to="/vm/create" replace />} />
            <Route path="/kubernetes" element={<Navigate to="/kubernetes/create" replace />} />
          </Routes>
        </main>
        <footer>
          <p>PaaS Provider &copy; 2023</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
