import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./app/layout";
import Home from "./pages/Home/Home";
import { LoginPage } from "./pages/Login/LoginPage";
import { RegisterPage } from "./pages/Register/RegisterPage";
import { CreatePostPage } from "./pages/CreatePost/CreatePostPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { PostPage } from "./pages/PostPage/PostPage";
import { CreateCommentPage } from "./pages/CreateComment/CreateCommentPage";

function App() {
  return (
    <BrowserRouter basename="/Travel__blog">
      <Routes>
        {/* Layout — родительский роут, он всегда на экране */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="posts" element={<CreatePostPage />} />
          <Route path="posts/:id" element={<PostPage />} />
          <Route path="posts/:id/comment" element={<CreateCommentPage />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
