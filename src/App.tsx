import React from "react";
import "./styles/global.css";
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import Overview from "./components/Overview";
import SimulationFlow from "./components/SimulationFlow";
import RoleCards from "./components/RoleCards";
import FacilitatorMode from "./components/FacilitatorMode";
import Reflection from "./components/Reflection";
import Summary from "./components/Summary";

const App: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <Overview />
      <SimulationFlow />
      <RoleCards />
      <FacilitatorMode />
      <Reflection />
      <Summary />
    </Layout>
  );
};

export default App;
