import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './app/layout';
import Home from './pages/Home/Home'; 
import {LoginPage} from './pages/Login/LoginPage';
import { RegisterPage } from './pages/Register/RegisterPage';
import { ProfileEdit } from './components/Profile/ProfileEdit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout — родительский роут, он всегда на экране */}
        <Route path="/" element={<Layout />}>
          {/* index означает, что Home откроется по адресу "/" */}
          <Route index element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} /> 
           <Route path="/profile" element={<ProfileEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;