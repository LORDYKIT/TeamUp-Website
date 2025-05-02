import { Container } from "@chakra-ui/react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { Navigate, Route, Routes } from "react-router-dom";
import userAtom from "./atoms/userAtom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import WelcomePage from "./pages/WelcomePage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import HomePage from "./components/Post";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import FeaturesPage from "./pages/FeaturesPage";
import AboutPage from "./pages/AboutPage";


function App() {
 
  const user = useRecoilValue(userAtom);
  const isAuthenticated = !!user;




  return (
    
    <Container maxW="1000px" pt="80px"> {/* Add padding top to avoid overlap with header */}
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/create-post" element={<CreatePost />} />
        {isAuthenticated ? (
          <>
           <Route path="/chat" element={<ChatPage />} />
            <Route path="/user/:_id" element={<UserPage />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/:user_id/post/:_id" element={<PostPage />} />
          </>
        ) : (
          <Route path="/:user_id/post/:_id" element={<Navigate to="/signup" />} />
        )}
      </Routes>
    </Container>
  );
}

export default function RootApp() {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
}
