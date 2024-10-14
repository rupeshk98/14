import React from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const HomePage = () => {
  return (
    <div className="grid px-10  grid-cols-1 lg:grid-cols-2 items-center h-full  xl:gap-[100px]  ">
      {/* left side */}
      <div className=" flex-1 flex flex-col items-center justify-center gap-4 lg:text-center lg:mx-20 ">
        <h1 className=" text-[70px] mt-3 lg:text-[130px] bg-gradient-to-r from-[#217bfe] to-[#e55571] text-transparent bg-clip-text 	">
          Alphabot
        </h1>

        <h2 className=" text-xl lg:text-3xl ">
          Supercharge your creativity and productivity
        </h2>
        <h3 className=" font-normal">
          Chat to start writing, planning, learning and more with Alphabot
        </h3>
        <Link
          to="/dashboard"
          className=" px-4 py-2 hover:bg-white hover:text-[#2e5b9e] bg-[#217bfe] text-white rounded-full text-sm mt-5"
        >
          Get Started
        </Link>
      </div>
      {/* right side */}
      <div className="flex-1 flex h-full items-center justify-center mb-10  ">
        <div className=" flex  items-center justify-center rounded-[50px]">
          <div className=" w-full h-full overflow-hidden rounded-[50px] bg-white">
            <img
              src="/hero.jpg"
              alt="hero image"
              className=" w-full h-full  rounded-3xl  object-contain "
            />
            {/* Chat */}
            <div className=" absolute flex items-center gap-[10px] mt-5 ">
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  "Give me a list of 5 well-known sci-fi books and show the results in a table with descriptions",
                  1000, // wait 1s before replacing "Mice" with "Hamsters"
                  "Sure, here is an image of a futuristic car driving through an old mountain road surrounded by nature:",
                  1000,
                  "Generate an image of a futuristic car driving through an old mountain road surrounded by nature",
                  1000,
                  "Rewrite this email draft to make it more clear and concise",
                  1000,
                ]}
                wrapper="span"
                repeat={Infinity}
                cursor={true}
                omitDeletionAnimation={true}
              />
            </div>
          </div>
        </div>
      </div>
      {/* term */}
      <div className=" absolute  lg:flex items-center gap-[10px]  hidden lg:bottom-5  ">
        <img src="/logo.svg" alt=" logo" className=" w-36 " />
        <div>
          <Link to={"/"}>Privacy and Terms</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
