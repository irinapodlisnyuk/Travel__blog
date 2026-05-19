import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./app/layout";
import Home from "./pages/Home/Home";
import { LoginPage } from "./pages/Login/LoginPage";
import { RegisterPage } from "./pages/Register/RegisterPage";
import { CreatePostPage } from "./pages/CreatePost/CreatePostPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { PostDetailPage } from "./pages/PostDetailPage/PostDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout — родительский роут, он всегда на экране */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="posts" element={<CreatePostPage />} />
          <Route path="posts/:id" element={<PostDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
