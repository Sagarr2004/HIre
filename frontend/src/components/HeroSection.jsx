// import React, { useState } from 'react'
// import { Button } from './ui/button'
// import { Search } from 'lucide-react'
// import { useDispatch } from 'react-redux';
// import { setSearchedQuery } from '@/redux/jobSlice';
// import { useNavigate } from 'react-router-dom';

// const HeroSection = () => {
//     const [query, setQuery] = useState("");
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const searchJobHandler = () => {
//         dispatch(setSearchedQuery(query));
//         navigate("/browse");
//     }

//     return (
//         <div className='text-center'>

//             <div className='flex flex-col gap-5 my-10'>
//                 <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 HireNest Website</span>
//                 <h1 className='text-5xl font-bold'>Swipe Right <br /> on Your<span className='text-[#219C90]'> Dream Job!</span></h1>
//                 <h1>Connecting Talent with Opportunity, Effortlessly</h1>
//                 <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
//                     <input
//                         type="text"
//                         placeholder='Find your dream jobs'
//                         onChange={(e) => setQuery(e.target.value)}
//                         className='outline-none border-none w-full'
//                     />
//                     <Button onClick={searchJobHandler} className="rounded-r-full bg-[#219C90]">
//                         <Search className='h-5 w-5' />
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default HeroSection


import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import jobImage from "../assets/Job_3.jpg";

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div
            className="relative w-full h-screen flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
            // style={{ backgroundImage: `url(${jobImage})`, backgroundSize: "100% 100%", filter:"blur(4px)", backgroundPosition: "center" }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${jobImage})`, backgroundSize: "100% 100%", filter: "blur(4px)" }}
            ></div>
            {/* Overlay for better text readability */}
            {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}

            <div className="relative z-10 flex flex-col gap-5  max-w-3xl">
                <span className="mx-auto px-4 py-2 rounded-full bg-[#F83002] text-white font-medium shadow-lg">
                    🚀 No. 1 HireNest Platform
                </span>

                <h1 className="text-6xl font-extrabold leading-tight">
                    Swipe Right <br /> on Your <span className="text-[#00E676]">Dream Job!</span>
                </h1>

                <p className="text-lg font-medium">
                    Connecting <span className="font-semibold text-[#FFD700]">Talent</span> with <span className="font-semibold text-[#FFD700]">Opportunity</span>, Effortlessly!
                </p>

                {/* Search Bar */}
                <div className="flex w-[60%] bg-white text-black rounded-full items-center mx-auto shadow-md overflow-hidden">
                    <input
                        type="text"
                        placeholder="Find your dream job..."
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-4 py-3 outline-none text-lg border-none rounded-l-full"
                    />
                    <Button 
                        onClick={searchJobHandler} 
                        className="rounded-r-full bg-[#00E676] hover:bg-[#00C853] px-5 py-3"
                    >
                        <Search className="h-6 w-6 text-white" />
                    </Button>
                </div>

                {/* CTA Button */}
                <Button className="bg-[#F83002] px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#D72600] shadow-md mx-auto">
                    Start Your Job Search 🚀
                </Button>
            </div>
        </div>
    );
};

export default HeroSection;

