import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Experiment from "@/pages/Experiment";
import BrainMapPage from "@/pages/BrainMapPage";
import BrainReplay from "@/experiments/BrainReplay";
import Navbar from "@/components/Navbar";
import ParticleBackground from "@/components/ParticleBackground";

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-museum-950">
        <ParticleBackground />
        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experiment/:id" element={<Experiment />} />
            <Route path="/brain-map" element={<BrainMapPage />} />
            <Route path="/brain-replay" element={<BrainReplay />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
