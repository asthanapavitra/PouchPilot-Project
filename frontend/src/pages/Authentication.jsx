import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";


const Authentication = () => {
  const navigate = useNavigate();
  const[isLoggingIn,setIsLoggingIn]=useState(false)

  const blueRef = useRef(null);
  const loginRef = useRef(null);
  const registerForm = useRef(null);
  const loginText = useRef(null);
  const registerText = useRef(null);
  const [wasActive, setWasActive] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 540);
  const tl = useRef(null);

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { setUser } = useContext(UserDataContext);

  const [message, setMessage] = useState("");
  const [messageFromRegister, setMessageFromRegister] = useState(null);
  const [registrationDone, setRegistrationDone] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 540);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Ensure it runs on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useGSAP(() => {
    const tl = gsap.timeline();

    if (isMobile) {
      if (isLoginOpen) {
        setWasActive(true); // Ensure reverse animation can trigger later

        tl.to(registerForm.current, {
          height: "0%",
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            registerForm.current.style.visibility = "hidden"; // Instead of display: none
          },
        });

        tl.to(blueRef.current, {
          height: "100%",
          bottom: "0%",
          borderRadius: "0px",
          duration: 0.4,
          ease: "power2.inOut",
        });

        tl.to(registerText.current, {
          opacity: 0,
          duration: 0.8,
        });

        tl.to(blueRef.current, {
          translateY: "-75%",
          duration: 0.4,
          borderRadius: "90px",
        });

        tl.to(loginText.current, {
          bottom: "-30%",
          opacity: 1,
          duration: 0.3,
        });

        tl.to(loginRef.current, {
          bottom: "10%",
          opacity: 1,
          duration: 0.6,
          ease: "power2.inOut",
          visibility: "visible",
        });
      } else if (!isLoginOpen && wasActive) {
        registerForm.current.style.visibility = "visible"; // Re-enable visibility

        tl.to(loginRef.current, {
          bottom: "-100%",
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        });

        tl.to(blueRef.current, {
          translateY: "0%",
          duration: 0.4,
          borderRadius: "0px",
        });

        tl.to(loginText.current, {
          opacity: 0,
          duration: 0.3,
        });

        tl.to(blueRef.current, {
          bottom: "-73%",
          borderRadius: "90px",
          duration: 0.4,
          ease: "power2.inOut",
        });

        tl.to(registerText.current, {
          y: "0%",
          opacity: 1,
          duration: 0.8,
        });

        tl.to(registerForm.current, {
          top: "2%",
          height: "60%",
          opacity: 1,
          duration: 0.4,
        });
      }
    } else {
      // Desktop animations (original horizontal animations)
      if (isLoginOpen) {
        setWasActive(true);
        tl.to(registerForm.current, {
          width: "0%",
          translateX: "-10%",
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            registerForm.current.style.display = "none";
          },
        });

        tl.to(blueRef.current, {
          right: "0%",
          borderRadius: "0px",
          duration: 0.4,
          ease: "power2.inOut",
        });

        tl.to(registerText.current, {
          right:"20%",
          opacity: 0,
          duration: 0.3,
        });

        tl.to(blueRef.current, {
          translateX: window.innerWidth < 800 ? "-55%" : "-60%",
          duration: 0.4,
          borderRadius: "90px",
        });

        tl.to(loginText.current, {
          right: "-30%",
          opacity: 1,
          duration: 0.3,
        });

        tl.to(loginRef.current, {
          right: "0%",
          opacity: 1,
          duration: 0.6,
          ease: "power2.inOut",
          visibility: "visible",
        });
      } else if (isLoginOpen == false && wasActive == true) {
        registerForm.current.style.display = "block";

        tl.to(loginRef.current, {
          right: "-100%",
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        });

        tl.to(blueRef.current, {
          translateX: "0%",
          duration: 0.4,
          borderRadius: "0px",
        });

        tl.to(loginText.current, {
          opacity: 0,
          duration: 0.3,
        });

        tl.to(blueRef.current, {
          right: "-73%",
          borderRadius: "90px",
          duration: 0.4,
          ease: "power2.inOut",
        });

        tl.to(registerText.current, {
          x: "0%",
          opacity: 1,
          duration: 0.8,
        });

        tl.to(registerForm.current, {
          width: "60%",
          translateX: "10%",
          opacity: 1,
          duration: 0.4,
        });
      }
    }
  }, [isLoginOpen, isMobile]);
  const handleLoginOpen = (value) => {
    setIsLoginOpen(value);
  };
  const handleRegisterForm = async (e) => {
    e.preventDefault();
    const userData = {
      userName: registerUsername,
      email: registerEmail,
      password: registerPassword,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        userData
      );

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        setMessage("Registration successful,login now");
        setMessageFromRegister(true);
        setRegistrationDone(true);
        setTimeout(() => {
          setMessage("");
          setMessageFromRegister(null);
          setRegistrationDone(false);
        }, 15000);
      }
    } catch (err) {
      // Check if error response exists
      if (err.response) {
        console.error("Error Response:", err.response.data); // Log full error response
        console.error("Status:", err.response.status); // Log the status code

        // Handle errors based on status codes
        if (err.response.status === 400 || err.response.status === 401) {
          const errorMessages = err.response.data.errors
            ?.map((error) => error.message)
            .join("\n");
          console.log(errorMessages);
          setMessage(errorMessages || "An error occurred.");
          setMessageFromRegister(true);
          setTimeout(() => {
            setMessage("");
            setMessageFromRegister(null);
          }, 15000);
        }
      } else {
        console.error("Error:", err.message); // Log network or other errors
      }
    }
  };

  const handleLoginForm = async (e) => {
    setIsLoggingIn(true);
    e.preventDefault();
    const userData = {
      identifier: loginIdentifier,
      password: loginPassword,
    };

    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.token);
        setUser(data.user);
        window.history.back();
        
      }
    } catch (err) {
      // Check if error response exists
      if (err.response) {
        // Handle errors based on status codes
        if (
          err.response.status === 400 ||
          err.response.status === 401 ||
          err.response.status == 500 ||
          err.response.status == 503
        ) {
          const errorMessages = err.response.data.errors
            ?.map((error) => error.message)
            .join("\n");
          console.log(errorMessages);
          setMessage(errorMessages || "An error occurred.");
          setMessageFromRegister(false);
          setTimeout(() => {
            setMessage("");
            setMessageFromRegister(null);
          }, 15000);
        }
      } else {
        console.error("Error:", err.message); // Log network or other errors
      }
    }
  };
  return (
    <div className="bg-white h-screen w-screen flex justify-center items-center overflow-hidden">
       {isLoggingIn &&(<div className="fixed top-0 left-0 w-full bg-black text-white z-50 flex items-center justify-center h-12">
        <span className="text-lg font-medium">
        Logging you in<span className="dot-animation ml-1">.</span>
        </span>
      </div>)}
      <div
        className={` w-[90%] sm:w-[90%] lg:w-[80%] xl:w-[60%] ${
          isMobile ? "h-[90%]" : "h-[70%]"
        } rounded-lg overflow-hidden relative flex items-center justify-center shadow-2xl `}
      >
        {/* White Container - Holds Register & Login Forms */}
        <div
          className={`h-full bg-white w-full absolute gap-5  flex ${
            isMobile ? "flex-col" : "flex-row "
          } justify-between items-center rounded-lg shadow-2xl`}
        >
          {/* Register Form - Visible */}
          <div
            ref={registerForm}
            className={`${
              isMobile ? "h-[90%] w-full mt-2" : "w-[60%] -mt-10  h-full "
            }
            ${
              window.innerWidth >= 768? "absolute top-[20%] " : ""
            } 
            relative flex flex-col self-center  items-center justify-start z-10`}
          >
            <h1 className="font-semibold w-[90%] lg:w-[75%] text-3xl text-center mb-3">
              Registration
            </h1>
            {message && messageFromRegister == true && (
              <p
                className={`${
                  registrationDone === true ? "bg-blue-500" : "bg-red-500"
                } text-white px-2 py-1 mb-2 w-[80%] sm:w-[60%] rounded-sm  text-xs text-center`}
              >
                {message}
              </p>
            )}{" "}
            {/* Error Message for Register */}
            <form
              onSubmit={handleRegisterForm}
              className={`flex  flex-col  w-[90%] md:w-[70%] lg:w-[85%] ${
                window.innerWidth >= 1024 ? "mt-2 gap-2 " : "mt-5 gap-4"
              }`}
            >
              <div className="w-full bg-[#EFEFEF] flex justify-between items-center px-2">
                <input
                  value={registerUsername}
                  onChange={(e) => {
                    setRegisterUsername(e.target.value);
                  }}
                  type="text"
                  required
                  className="rounded-sm p-2 w-full outline-0"
                  placeholder="Username"
                />
                <i className="ri-user-3-fill text-xl"></i>
              </div>
              <div className="w-full bg-[#EFEFEF] flex justify-between items-center px-2 ">
                <input
                  value={registerEmail}
                  required
                  onChange={(e) => {
                    setRegisterEmail(e.target.value);
                  }}
                  type="text"
                  className="bg-[#EFEFEF] rounded-sm p-2 outline-0"
                  placeholder="Email"
                />
                <i className="ri-mail-fill text-xl"></i>
              </div>
              <div className="w-full bg-[#EFEFEF] flex justify-between items-center px-2">
                <input
                  value={registerPassword}
                  required
                  onChange={(e) => {
                    setRegisterPassword(e.target.value);
                  }}
                  type="password"
                  className="bg-[#EFEFEF] rounded-sm p-2 outline-0"
                  placeholder="Password"
                />
                <i className="ri-lock-password-fill text-xl"></i>
              </div>
              <div className="flex gap-1 mt-1 items-center ml-1 ">
                <input type="checkbox" name="" id="" required />
                <p className="text-xs text-gray-400 tracking-tighter  mt-1  ">
                  Subscribe to recieve StarPhenom email
                </p>
              </div>
              <div className="flex gap-1  items-center ml-1 ">
                <input type="checkbox" name="" id="" required />
                <p className="text-xs text-gray-400 tracking-tighter">
                  I have read, understood and agree to the privacy policy
                </p>
              </div>
              <button
                type="submit"
                className="w-full mt-1 text-white text-center font-bold bg-black py-2 rounded-md"
              >
                Register
              </button>
            </form>
            <div className="flex flex-col mt-3 justify-between items-center w-[90%] lg:w-[75%]">
              <p className="text-xs text-gray-500 text-center">
                or register with other platforms
              </p>
              <div className="flex w-[90%] mt-2 justify-center items-center gap-3">
                <i className="ri-google-fill text-lg"></i>
                <i className="ri-facebook-fill text-xl"></i>
                <i className="ri-github-fill text-lg"></i>
                <i className="ri-linkedin-fill text-lg"></i>
              </div>
            </div>
          </div>

          {/* Blue Background Panel - Half Visible, Half Overflowing */}
          <div
            ref={blueRef}
            className={`bg-black absolute ${
              isMobile
                ? "bottom-[-85%] w-full h-[110%] flex-col py-4"
                : "right-[-70%] md:right-[-69%] lg:right-[-75%] w-[110%] h-full flex-row"
            } 
              flex pl-15 pr-10 justify-between items-center text-white ${
                isMobile ? "rounded-[60px]" : "rounded-[90px]"
              } z-10`}
          >
            <div ref={registerText} className="text-center">
              <h2
                className={`text-xl md:text-2xl font-bold mb-2 ${
                  isMobile ? "mt-4" : ""
                }`}
              >
                Welcome Back!
              </h2>
              <p className="text-xs">Already have an account?</p>
              <button
                onClick={() => {
                  handleLoginOpen(true);
                }}
                type="button"
                className="mt-2 w-[70%] font-semibold bg-transparent rounded-md px-2 py-1 border-2 border-white"
              >
                Login
              </button>
            </div>
            <div ref={loginText} className="text-center opacity-0 mb-5">
              <h2 className="text-lg sm:text-lg font-bold mb-2">
                Hello Welcome Back!
              </h2>
              <p className="text-xs">Don't have an account?</p>
              <button
                onClick={() => {
                  handleLoginOpen(false);
                }}
                type="button"
                className="mt-2 w-[70%] font-semibold bg-transparent rounded-md px-2 py-1 border-2 border-white"
              >
                Register
              </button>
            </div>
          </div>

          {/* Login Form - Fully Overflowed Right */}
          <div
            ref={loginRef}
            className={`absolute ${
              isMobile
                ? "bottom-[-100%] h-[60%] w-full"
                : "right-[-100%] md:right-[-80%] lg:right-[-70%] w-[60%] h-full"
            } 
              flex flex-col items-center justify-center bg-white`}
          >
            {
            <Link to={"/admin"}>
             <i

                className={`absolute top-5 right-10 text-xl ri-admin-line`}
              ></i></Link>
             
            }
            <h1 className="font-semibold text-3xl text-center mb-2">Login</h1>
            {message && messageFromRegister === false && (
              <p className="bg-red-500 text-white px-2 py-1 mb-2 w-[80%] sm:w-[60%] rounded-sm  text-xs text-center">
                {message}
              </p>
            )}{" "}
            {/* Error Message for Login */}
            <form
              onSubmit={handleLoginForm}
              className="flex flex-col gap-2 w-[90%] lg:w-[75%]"
            >
              <div className="w-full bg-[#EFEFEF] flex justify-between pr-5 items-center px-2">
                {/* Role Selection */}

                <input
                  value={loginIdentifier}
                  required
                  onChange={(e) => {
                    setLoginIdentifier(e.target.value);
                  }}
                  type="text"
                  className="rounded-sm p-2 w-full outline-0"
                  placeholder="Enter email or username"
                />
                <i className="ri-mail-fill text-xl"></i>
              </div>
              <div className="w-full bg-[#EFEFEF] flex justify-between items-center pr-5 px-2">
                <input
                  value={loginPassword}
                  required
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                  }}
                  type="password"
                  className="bg-[#EFEFEF] rounded-sm p-2 outline-0"
                  placeholder="Password"
                />
                <i className="ri-lock-password-fill text-xl"></i>
              </div>
              <p className="text-center text-gray-500 text-sm mt-2.5">
                Forgot password?
              </p>
              <button
                type="submit"
                className="w-full mt-2 text-white text-center font-bold bg-black py-1 rounded-md"
              >
                Login
              </button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-4">
              or login with social media platforms
            </p>
            <div className="flex w-full mt-2 ml-[60%] gap-3 items-center">
              <i className="ri-google-fill px-1 py-1 text-lg"></i>
              <i className="ri-facebook-fill px-1 text-xl"></i>
              <i className="ri-github-fill px-1 py-1 text-lg"></i>
              <i className="ri-linkedin-fill px-1 py-1 text-lg"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
