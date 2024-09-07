import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  useToast,
  Button,
  Text,
  Stack,
  Flex,
  Box,
  Center,
  Input,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { BiShow, BiHide } from "react-icons/bi";
import { register } from "../utils/apis";
import Navbar from "../components/navbar";
import useAuthStore from "../authStore";

export default function Register() {
  const { userName, userEmail, setUserName, setUserEmail, addAuth } =
    useAuthStore((state) => {
      return {
        userName: state.userName,
        userEmail: state.userEmail,
        setUserName: state.setUserName,
        setUserEmail: state.setUserEmail,
        addAuth: state.addAuth,
      };
    });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let errorDescription = "";
    const credentials = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    const password2 = password2Ref.current.value;
    if (
      !(
        credentials.username &&
        credentials.email &&
        credentials.password &&
        password2
      )
    ) {
      toast({
        title: "Data Error",
        description: "Please enter data in all the fields!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (credentials.password !== password2) {
      toast({
        title: "Password Error",
        description:
          'Password entered in "Confirm Password" field doesn\'t match the "Password" field',
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await register(credentials);
      if (response.status === 201) {
        setUserName(response.data.user.username);
        setUserEmail(response.data.user.email);
        addAuth();
        toast({
          title: "Success",
          description: "User registered successfully!",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        navigate('/home')
      }
    } catch (err) {
      if (err.response.data.errors.username) {
        errorDescription += err.response.data.errors.username;
      } else if (err.response.data.errors.email) {
        errorDescription += err.response.data.errors.email;
      } else if (err.response.data.errors.password) {
        errorDescription += err.response.data.errors.password;
      }
      toast({
        title: "Error",
        description: errorDescription,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <Center m={0} p={0}>
        <Stack>
          <Stack textAlign="center" color="#646681" fontWeight="500" mb="2rem">
            <Text fontSize={["1.7rem", "2.2rem"]} fontWeight="600">
              Register with us
            </Text>
            <Text fontSize={["1rem", "1.2rem"]}>
              Please create user account
            </Text>
          </Stack>

          <Flex
            direction="column"
            bg="#ecedf6"
            w={["20rem", "27rem"]}
            px={["1rem", "2rem"]}
            py={["1rem", "2rem"]}
            borderRadius="0.4rem"
            mb="1rem"
          >
            <form onSubmit={onSubmit}>
              <Box mb={["1rem", "1.5rem"]}>
                <Text mb="0.5rem" fontSize={["1.1rem", "1.2rem"]}>
                  Username:{" "}
                </Text>
                <Box bg="#ffffff" borderRadius="0.4rem">
                  <Input
                    type="text"
                    focusBorderColor="#4250f5"
                    id="name"
                    name="name"
                    placeholder="Enter your name..."
                    ref={nameRef}
                  />
                </Box>
              </Box>
              <Box mb={["1rem", "1.5rem"]}>
                <Text mb="0.5rem" fontSize={["1.1rem", "1.2rem"]}>
                  Email:{" "}
                </Text>
                <Box bg="#ffffff" borderRadius="0.4rem">
                  <Input
                    type="email"
                    focusBorderColor="#4250f5"
                    id="email"
                    name="email"
                    placeholder="Enter your email..."
                    ref={emailRef}
                  />
                </Box>
              </Box>
              <Box mb={["1rem", "1.5rem"]}>
                <Text mb="0.5rem" fontSize={["1.1rem", "1.2rem"]}>
                  Password:{" "}
                </Text>
                <Box bg="#ffffff" borderRadius="0.4rem">
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      focusBorderColor="#4250f5"
                      id="password"
                      name="password"
                      placeholder="Enter your password..."
                      ref={passwordRef}
                    />
                    <InputRightElement onClick={handleShowPassword}>
                      {showPassword ? (
                        <BiHide
                          style={{ width: "20px", height: "20px" }}
                          color="#3d3d3d"
                        />
                      ) : (
                        <BiShow
                          style={{ width: "20px", height: "20px" }}
                          color="#3d3d3d"
                        />
                      )}
                    </InputRightElement>
                  </InputGroup>
                </Box>
              </Box>
              <Box mb={["1rem", "1.5rem"]}>
                <Text mb="0.5rem" fontSize={["1.1rem", "1.2rem"]}>
                  Confirm Password:{" "}
                </Text>
                <Box bg="#ffffff" borderRadius="0.4rem">
                  <Input
                    type="password"
                    focusBorderColor="#4250f5"
                    id="password2"
                    name="password2"
                    placeholder="Confirm Password..."
                    ref={password2Ref}
                  />
                </Box>
              </Box>
              <Center>
                {loading ? (
                  <Button isLoading loadingText="Signing Up...">
                    Register
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    letterSpacing={1}
                    mt={["1rem", ""]}
                    fontSize={["1rem", "1.2rem"]}
                    bg="#4250f5"
                    color="white"
                    _hover={{
                      bg: "#2732b8",
                    }}
                  >
                    Register
                  </Button>
                )}
              </Center>
            </form>
          </Flex>
          <Center>
            <Text
              color="#646681"
              fontSize={["1.1rem", "1.2rem"]}
              fontWeight="500"
            >
              Already registered with us?{" "}
              <Text as="span" color="#4250f5" fontWeight="600">
                <Link to="/">Login</Link>
              </Text>
            </Text>
          </Center>
        </Stack>
      </Center>
    </>
  );
}
