import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import Overview from "./components/Overview";
import SimulationFlow from "./components/SimulationFlow";
import RoleCards from "./components/RoleCards";
import RolePage from "./components/RolePage";
import Reflection from "./components/Reflection";

const App: React.FC = () => (
  <HashRouter>
    <Layout>
      <Routes>
        <Route path="/"              element={<Hero />} />
        <Route path="/background"    element={<Overview />} />
        <Route path="/flow"          element={<SimulationFlow />} />
        <Route path="/roles"         element={<RoleCards />} />
        <Route path="/roles/:roleId" element={<RolePage />} />
        <Route path="/reflection"    element={<Reflection />} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  </HashRouter>
);

export default App;
