import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './app/layout';
import Home from './pages/Home/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout — родительский роут, он всегда на экране */}
        <Route path="/" element={<Layout />}>
          {/* index означает, что Home откроется по адресу "/" */}
          <Route index element={<Home />} />
          {/* <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;