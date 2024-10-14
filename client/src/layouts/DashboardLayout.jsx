import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ChatList from "../Components/ChatList";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing the menu icons

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to manage mobile menu visibility

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return "Loading...";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="w-screen h-screen flex lg:gap-[50px] pt-5 relative bg-[#12101b]">
      {/* Mobile Menu Icon */}
      <div className="absolute top-4 left-4 lg:hidden">
        <button className="focus:outline-none">
          <FaBars
            className="w-8 h-8 text-white z-50"
            onClick={toggleMobileMenu}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-2/3 h-full bg-[#1f1e2d] text-white transform ${
          isMobileMenuOpen ? "translate-x-0 z-40" : "-translate-x-full"
        } transition-transform duration-300 lg:hidden`}
      >
        <div className="p-4">
          {/* Close button */}
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            <FaTimes className="w-6 h-6" />
          </button>
          <nav className="mt-10 z-50">
            {/* Mobile Menu List */}
            <div className="space-y-4 ">
              <div>
                <ChatList />
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Menu for Desktop */}
      <div className="hidden lg:block lg:flex-1 px-2 bg-[#1f1e2d]">
        <ChatList />
      </div>

      {/* Content */}
      <div className="flex-[4] bg-[#12101b] overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
