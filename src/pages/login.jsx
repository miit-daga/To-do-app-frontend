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
import { login } from "../utils/apis";
import Navbar from "../components/navbar";
import useAuthStore from "../authStore";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isAuth, addAuth, setUserName, setUserEmail } = useAuthStore(
    (state) => {
      return {
        isAuth: state.isAuth,
        addAuth: state.addAuth,
        setUserName: state.setUserName,
        setUserEmail: state.setUserEmail,
      };
    },
  );
  const toast = useToast();
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e) => {
    const credentials = {
      username: userNameRef.current.value,
      password: passwordRef.current.value,
    };
    e.preventDefault();
    if (!(credentials.username && credentials.password)) {
      toast({
        title: "Data Error",
        description: "Please enter both email and password",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (isAuth !== false) {
      toast({
        title: "App in use",
        description: "Kindly logout the current user first!",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await login(credentials);
      if (response.status === 200) {
        addAuth();
        setUserName(response.data.user.username);
        setUserEmail(response.data.user.email);
        toast({
          title: "Success",
          description: "Logged in successfully!",
          status: "success",
          duration: 1000,
          isClosable: true,
          position: "top",
          onCloseComplete: () => {
            navigate("/home");
          },
        });
      }
    } catch (err) {
      let errorDescription = "";
      if (err.response.data.errors.username) {
        errorDescription += err.response.data.errors.username;
      } else if (err.response.data.errors.password) {
        errorDescription += err.response.data.errors.password;
      }
      toast({
        title: "Error",
        description: errorDescription,
        status: "error",
        duration: 1000,
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
          <Text
            textAlign="center"
            color="#646681"
            fontSize={["1.7rem", "2.2rem"]}
            fontWeight="600"
            mb={["1.5rem", "2rem"]}
          >
            Login
          </Text>
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
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    ref={userNameRef}
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
                      placeholder="Enter your password"
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
              <Center>
                {loading ? (
                  <Button isLoading loadingText="Logging In...">
                    Login
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
                    Login
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
              Don't have an account?{" "}
              <Text as="span" color="#4250f5" fontWeight="600">
                <Link to="/register">Register</Link>
              </Text>
            </Text>
          </Center>
        </Stack>
      </Center>
    </>
  );
}
