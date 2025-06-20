import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import VirtualMachinePage from './pages/VirtualMachinePage';
import KubernetesClusterPage from './pages/KubernetesClusterPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>PaaS Provider</h1>
          <nav>
            <ul>
              <li>
                <Link to="/vm">Виртуальная Машина</Link>
              </li>
              <li>
                <Link to="/kubernetes">Kubernetes Кластер</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<div className="welcome">Выберите тип ресурса для создания</div>} />
            <Route path="/vm" element={<VirtualMachinePage />} />
            <Route path="/kubernetes" element={<KubernetesClusterPage />} />
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