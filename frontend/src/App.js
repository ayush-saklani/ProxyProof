import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Student from './pages/Student';
import Faculty from './pages/Faculty';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/student" element={<Student />} />
          <Route path="/faculty" element={<Faculty />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
