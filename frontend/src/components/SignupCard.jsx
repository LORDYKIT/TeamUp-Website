
import {
	Flex, Box, FormControl, FormLabel, Input, InputGroup,
	HStack, InputRightElement, Stack, Button, Heading, Text,
	Link,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
  import { useSetRecoilState } from "recoil";
  import authScreenAtom from "../atoms/authAtom";
  import useShowToast from "../hooks/useShowToast";
  import { useNavigate } from "react-router-dom";
  import { useUser } from '../context/UserContext';
  import userAtom from "../atoms/userAtom";
  
  export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const { setUser, setUsers } = useUser();  // Access setUsers to update the context
	const [inputs, setInputs] = useState({
	  fullname: "",
	  username: "",
	  email: "",
	  password: "",
	});
	const showToast = useShowToast();
	const navigate = useNavigate();
	const setUserAtom = useSetRecoilState(userAtom);

	const handleSignup = async () => {
		const newUser = {
		  username: inputs.username,
		  fullname: inputs.fullname,
		  email: inputs.email,
		  password: inputs.password,
		  biography: "Hello I'm new to TeamUp!",
		  profile_picture: "/defaultProfile.png",
		};
	  
		try {
		  const response = await fetch('http://localhost:5000/api/auth/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newUser),
		  });
	  
		  if (response.ok) {
			const data = await response.json(); // Parse the response body
			const { user, token } = data; // Destructure user and token
	  
			
			setUser(user);
			localStorage.setItem('user-threads', JSON.stringify(user));
			localStorage.setItem('auth-token', token); // Save token securely
			setUserAtom(user);

			navigate(`/user/${user._id}`);
			showToast('Signup successful!', 'success');
		

		  } else {
			showToast('Failed to sign up.', 'error');
		  }
		} catch (error) {
		  console.error("Error during signup:", error);
		  showToast('Failed to sign up due to a network error.', 'error');
		}
	  };
	  
  
	return (
	  <Flex align={"center"} justify={"center"}>
		<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
		  <Stack align={"center"}>
			<Heading fontSize={"4xl"} textAlign={"center"} color="white" 
					fontFamily="'Playwrite DK Uloopet', sans-serif">
			  Sign up
			</Heading>
		  </Stack>
		  <Box rounded={"lg"}
                    backdropFilter="blur(5px)"
					// bg={"blackAlpha.100"}
					
					boxShadow={"lg"}
					p={8}
					w={{ base: "full", sm: "400px" }}>
			<Stack spacing={4}>
			  <HStack>
				<Box>
				  <FormControl isRequired>
					<FormLabel color="white">Full name</FormLabel>
					<Input
					color="white"
					  type="text"
					  value={inputs.fullname}
					  onChange={(e) => setInputs({ ...inputs, fullname: e.target.value })}
					/>
				  </FormControl>
				</Box>
				<Box>
				  <FormControl isRequired>
					<FormLabel color="white">Username</FormLabel>
					<Input
					color="white"
					  type="text"
					  value={inputs.username}
					  onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
					/>
				  </FormControl>
				</Box>
			  </HStack>
			  <FormControl isRequired>
				<FormLabel color="white">Email address</FormLabel>
				<Input
				  type="email"
				  value={inputs.email}
				  onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
				/>
			  </FormControl>
			  <FormControl isRequired>
				<FormLabel color="white">Password</FormLabel>
				<InputGroup>
				  <Input
					type={showPassword ? "text" : "password"}
					value={inputs.password}
					onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
				  />
				  <InputRightElement h={"full"}>
					<Button
					  variant={"ghost"}
					  onClick={() => setShowPassword(!showPassword)}
					>
					  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
					</Button>
				  </InputRightElement>
				</InputGroup>
			  </FormControl>
			  <Stack spacing={10} pt={1} align="center">
				<button
						className="button-auth"
						onClick={handleSignup}
					
					>
						{"SignUp"}
						<span></span><span></span><span></span><span></span>
					</button>
			  </Stack>
			  <Stack pt={1}>
				<Text align={"center"} color="white" fontWeight="bold">
				  Already a user?{" "}
				  <Link color={"teal"} onClick={() => setAuthScreen("login")}>
					Login
				  </Link>
				</Text>
			  </Stack>
			</Stack>
		  </Box>
		</Stack>
	  </Flex>
	);
  }
  