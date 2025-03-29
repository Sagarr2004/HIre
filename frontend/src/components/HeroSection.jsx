import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import jobImage from "../assets/Job_3.jpg";
import CategoryCarousel from "./CategoryCarousel";

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center text-center text-white">
            {/* Blurred Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${jobImage})`, backgroundSize: "100% 100%", filter: "blur(4px)" }}
            ></div>
            <br/>
            {/* Content */}
            <motion.div className="relative z-10 flex flex-col gap-5 max-w-3xl">
                <motion.span 
                    className="mx-auto px-4 py-2 rounded-full bg-[#F83002] text-white font-medium shadow-lg"
                    whileHover={{ scale: 1.1 }}
                >
                    🚀 No. 1 JobHunting Platform
                </motion.span>

                <motion.h1 
                    className="text-6xl font-extrabold leading-tight text-white" 
                    style={{ textShadow: "9px 4px 4px rgba(0, 0, 0, 0.7)" }}
                    whileHover={{ scale: 1.1 }}
                >
                    Swipe Right <br /> on Your <span className="text-[#00E676]">Dream Job!</span>
                </motion.h1>
                
                <motion.p 
                    className="text-lg font-bold text-white bg-black bg-opacity-75 px-4 py-2 rounded-lg"
                    style={{ textShadow: "3px 3px 6px rgba(0, 0, 0, 1)" }}
                    whileHover={{ scale: 1.1 }}
                >
                    Connecting <span className="font-extrabold text-[#FFD700]">Talent</span> with <span className="font-extrabold text-[#FFD700]">Opportunity</span>, Effortlessly!
                </motion.p>
                <br/>
                {/* Search Bar */}
                <div className="flex w-[80%] bg-white text-black rounded-full items-center mx-auto shadow-md overflow-hidden">
                    <input
                        type="text"
                        placeholder="Find your dream job..."
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-4 py-3 outline-none text-lg border-1px rounded-l-full"
                    />
                    <Button 
                        onClick={searchJobHandler} 
                        className="rounded-r-full bg-[#FDFAF6] hover:bg-[#d2e7e7] px-5 py-3"
                    >
                        <Search className="h-6 w-6 text-black" />
                    </Button>
                </div>

                <br />
                <motion.span 
                    className="mx-auto px-4 py-2 rounded-full bg-[#F83002] text-white font-medium shadow-lg"
                    whileHover={{ scale: 1.1 }}
                >
                    Start Your Job Search 🚀
                </motion.span>
                <CategoryCarousel />
            </motion.div>
        </div>
    );
};

export default HeroSection;