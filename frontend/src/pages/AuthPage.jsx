import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";
import { Box } from "@chakra-ui/react";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);

  return (
    <Box position="relative" height="100vh" overflow="hidden">
      {/* Background Video */}
      <video
	   className="video-background"
        src="/6551622-hd_1920_1080_25fps.mp4" // Adjust the path if necessary
        autoPlay
        loop
        muted
		
      />

      {/* Auth Page Content */}
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
      </Box>
    </Box>
  );
};

export default AuthPage;
