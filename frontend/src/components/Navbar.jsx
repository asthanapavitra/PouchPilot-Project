import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SearchPanel from "./SearchPanel";

const Navbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [supportClicked, setSupportClicked] = useState(false);
  const [supportWasActive, setSupportWasActive] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const searchPanelRef = useRef(null);
  const navigate=useNavigate();
  useGSAP(() => {
    const timeline = gsap.timeline();

    if (props.logoPage == false) {
      timeline.fromTo(
        ".text-animation span",
        { opacity: 0 },
        { opacity: 1, stagger: 0.15, duration: 1 },
        0
      );
    }
  }, [props.logoPage]);

  useGSAP(() => {
    const timeline = gsap.timeline();
    if (supportClicked) {
      timeline.to(".support-animation h2", {
        translateX: "0",
        duration: 0.2,
      });
      timeline.to(".support-animation p", {
        opacity: 1,
        duration: 0.2,
      });
    }
    if (supportWasActive && supportClicked == false) {
      timeline.to(".support-animation p", {
        opacity: 0,
        duration: 0.2,
      });
      timeline.to(".support-animation h2", {
        translateX: "180%",
        duration: 0.2,
      });
    }
  }, [supportClicked]);
// Search panel animation
useGSAP(() => {
  if (showSearchPanel) {
    gsap.to(searchPanelRef.current, {
      y: 0,
      duration: 0.4,
      ease: "power3.out",
      onComplete: () => {
        gsap.set(searchPanelRef.current, { display: "block" });
      },
    });
    gsap.to(".home-page", {
      opacity: 0,
    });
  } else {
    gsap.to(searchPanelRef.current, {
      y: "-100%",
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => {
        gsap.set(searchPanelRef.current, { display: "none" });
      },
    });
    gsap.to(".home-page", {
      opacity: 1,
    });
  }
}, [showSearchPanel]);
  return (
    <div className="w-screen">
      <div
        ref={searchPanelRef}
        className="fixed top-[70px] left-0 w-full h-[calc(100vh-70px)] overflow-y-auto bg-white text-black z-[999] hidden"
        style={{ transform: "translateY(-100%)" }}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setShowSearchPanel(false)}
            className="text-black text-2xl"
          >
            ✕
          </button>
        </div>
        <div className="px-4">
          <SearchPanel />
        </div>
      </div>
      <nav className="h-[65px] fixed top-0 text-black w-full bg-white mb-4 shadow-lg z-990">
        <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:pl-8 lg:pr-2">
          <div className="flex h-full justify-between items-center py-4 relative">
            {props.username != null ? (
              <h2 className="text-xl flex gap-1 items-center">
                Hi, <span className="text-xl">{props.username}</span>
              </h2>
            ) : (
              <div
                className="flex items-center justify-between w-[5%]"
                onClick={() => setShowSearchPanel(true)}
              >
                <i className="ri-search-line mr-2 text-xl"> </i>Search
              </div>
            )}
            {/* Logo */}
            <Link to="/" className="text-2xl   w-[60%] text-center">
              <h2 className="text-2xl absolute left-[50%] -translate-x-1/2 top-[50%]  -translate-y-1/2 text-animation text-center">
                {["S", "T", "A", "R"].map((char, index) => (
                  <span key={index} className={char === " " ? "mx-1" : ""}>
                    {char}
                  </span>
                ))}
                {["P", "H", "E", "N", "O", "M"].map((char, index) => (
                  <span
                    key={index}
                    className={`${char === " " ? "mx-1" : ""} font-extrabold`}
                  >
                    {char}
                  </span>
                ))}
              </h2>
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden md:flex justify-end space-x-8 text-lg w-[35%]">
              <li>
                <div className="flex items-center justify-center gap-2 support-animation">
                  <h2
                    className="translate-x-[180%] hover:text-blue-400 cursor-pointer"
                    onMouseEnter={() => {
                      setSupportClicked(true);
                      setSupportWasActive(true);
                    }}
                    onClick={() => setSupportClicked(!supportClicked)}
                  >
                    Call us
                  </h2>
                  <p className="text-sm text-black opacity-0">
                    +91-63160144208
                  </p>
                </div>
              </li>
              <li>
                <Link to="/wishlist" className="group hover:text-red-500">
                  <i className="ri-heart-line text-xl group-hover:hidden"></i>
                  <i className="ri-heart-fill text-xl hidden group-hover:inline"></i>
                </Link>
              </li>
              <li>
                <button onClick={()=>{
                  navigate('/my-cart',{state:{cartPage:true}})
                }} className="group hover:text-blue-400">
                  <i className="ri-shopping-cart-line text-xl group-hover:hidden"></i>
                  <i className="ri-shopping-cart-fill text-xl hidden group-hover:inline"></i>
                </button>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-400">
                  <i className="ri-user-line text-xl"></i>
                </Link>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
