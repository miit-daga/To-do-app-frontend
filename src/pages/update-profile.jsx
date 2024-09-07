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
import Navbar from "../components/navbar";
import useAuthStore from "../authStore";
import { updateProfile } from "../utils/apis";

export default function UpdateProfile() {
    const { userName, userEmail, setUserName, setUserEmail } = useAuthStore((state) => ({
        userName: state.userName,
        userEmail: state.userEmail,
        setUserName: state.setUserName,
        setUserEmail: state.setUserEmail,
    }));
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
        const updates = {};
        
        if (nameRef.current.value) {
            updates.username = nameRef.current.value;
        }
        if (emailRef.current.value) {
            updates.email = emailRef.current.value;
        }
        const password = passwordRef.current.value;
        const password2 = password2Ref.current.value;

        if (password) {
            if (password !== password2) {
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
            updates.password = password;
        }

        if (Object.keys(updates).length === 0) {
            toast({
                title: "Data Error",
                description: "Please enter data in at least one field!",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await updateProfile(updates);
            if (response.status === 200) {
                if (response.data.username) {
                    setUserName(response.data.username);
                }
                if (response.data.email) {
                    setUserEmail(response.data.email);
                }
                toast({
                    title: "Success",
                    description: "User details updated successfully!",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "top",
                });
                navigate('/home');
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
                    <Stack textAlign="center" color="#646681" fontWeight="500" mb="2rem">
                        <Text fontSize={["1.7rem", "2.2rem"]} fontWeight="600">
                            Update Profile
                        </Text>
                        <Text fontSize={["1rem", "1.2rem"]}>
                            Please update your user details
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
                                        placeholder="Enter new username..."
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
                                        placeholder="Enter new email..."
                                        ref={emailRef}
                                    />
                                </Box>
                            </Box>
                            <Box mb={["1rem", "1.5rem"]}>
                                <Text mb="0.5rem" fontSize={["1.1rem", "1.2rem"]}>
                                    New Password:{" "}
                                </Text>
                                <Box bg="#ffffff" borderRadius="0.4rem">
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            focusBorderColor="#4250f5"
                                            id="password"
                                            name="password"
                                            placeholder="Enter new password..."
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
                                    Confirm New Password:{" "}
                                </Text>
                                <Box bg="#ffffff" borderRadius="0.4rem">
                                    <Input
                                        type="password"
                                        focusBorderColor="#4250f5"
                                        id="password2"
                                        name="password2"
                                        placeholder="Confirm new password..."
                                        ref={password2Ref}
                                    />
                                </Box>
                            </Box>
                            <Center>
                                {loading ? (
                                    <Button isLoading loadingText="Updating...">
                                        Update Profile
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
                                        Update Profile
                                    </Button>
                                )}
                            </Center>
                        </form>
                    </Flex>
                </Stack>
            </Center>
        </>
    );
}
