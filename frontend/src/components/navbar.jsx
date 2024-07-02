import React from "react";
import {
  Flex,
  Text,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Button,
  useMediaQuery,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import useAuthStore from "../authStore";
import { logOutUser } from "../utils/apis";

function Navbar() {
  const toast = useToast();
  const navigate = useNavigate();
  const { isAuth, removeAuth, setUserName, setUserEmail } = useAuthStore(
    (state) => ({
      isAuth: state.isAuth,
      removeAuth: state.removeAuth,
      setUserName: state.setUserName,
      setUserEmail: state.setUserEmail,
    })
  );

  const logout = () => {
    logOutUser();
    removeAuth();
    setUserName(null);
    setUserEmail(null);
    navigate("/");
    toast({
      title: "",
      description: "User successfully logged out!",
      status: "success",
      duration: 1000,
      isClosable: true,
      position: "top",
    });
  };

  // Check if screen width is less than 768px
  const [isSmallerThan768] = useMediaQuery("(max-width: 768px)");

  return (
    <Flex
      align="center"
      justify="space-between"
      h="5rem"
      w="100%"
      px={["1rem", "1.6rem"]}
      mb={["2rem", "3rem"]}
      boxShadow="0px 3px 6px rgba(0, 0, 0, 0.1)"
    >
      <Text
        color="#646681"
        fontWeight="extrabold"
        fontSize={["1.5rem", "2.2rem"]}
      >
        <Link to="/">Todo-App</Link>
      </Text>
      {isSmallerThan768 ? (
        <Flex>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<GiHamburgerMenu color="#4250f5" />}
              variant="outline"
              borderWidth="0.15rem"
              borderColor="#4250f5"
            />
            <MenuList>
              {isAuth ? (
                <>
                  <MenuItem
                    onClick={() => navigate("/updateprofile")}
                    fontSize="1.2rem"
                    icon={<AiOutlineUserAdd style={{ width: "20px", height: "20px" }} />}
                  >
                    Update user details
                  </MenuItem>
                  <MenuItem
                    onClick={logout}
                    fontSize="1.2rem"
                    icon={<BiLogOut style={{ width: "20px", height: "20px" }} />}
                  >
                    Logout
                  </MenuItem>
                </>
              ) : (
                <MenuItem
                  onClick={() => navigate("/register")}
                  fontSize="1.2rem"
                  icon={<AiOutlineUserAdd style={{ width: "20px", height: "20px" }} />}
                >
                  Register
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </Flex>
      ) : (
        <Flex>
          {isAuth ? (
            <>
              <Button
                onClick={() => navigate("/updateprofile")}
                letterSpacing={1}
                fontSize="1.2rem"
                bg="#6000f3"
                color="white"
                mr="20px"
                _hover={{ bg: "#2732b8" }}
              >
                Update user details
              </Button>
              <Button
                onClick={logout}
                color="white"
                bg="gray.500"
                letterSpacing={1}
                fontSize="1.2rem"
                _hover={{ bg: "gray.600" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/register")}
              letterSpacing={1}
              fontSize="1.2rem"
              bg="#4250f5"
              color="white"
              _hover={{ bg: "#2732b8" }}
            >
              Register
            </Button>
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default Navbar;
