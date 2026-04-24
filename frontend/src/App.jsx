import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Locker from './pages/Locker';
import Assistant from './pages/Assistant';
import Calendar from './pages/Calendar';
import Progress from './pages/Progress';
import Register from './pages/Register';
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Locker" element={<Locker />} />
            <Route path="/Assistant" element={<Assistant />} />
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/Progress" element={<Progress />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;