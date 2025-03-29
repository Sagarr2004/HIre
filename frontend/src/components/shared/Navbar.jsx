// import React from 'react'
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
// import { Button } from '../ui/button'
// import { Avatar, AvatarImage } from '../ui/avatar'
// import { LogOut, User2 } from 'lucide-react'
// import { Link, useNavigate } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios'
// import { USER_API_END_POINT } from '@/utils/constant'
// import { setUser } from '@/redux/authSlice'
// import { toast } from 'sonner'

// const Navbar = () => {
//     const { user } = useSelector(store => store.auth);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const logoutHandler = async () => {
//         try {
//             const res = await axios.get(${USER_API_END_POINT}/logout, { withCredentials: true });
//             if (res.data.success) {
//                 dispatch(setUser(null));
//                 navigate("/");
//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error.response.data.message);
//         }
//     }
//     return (
//         <div className='bg-white'>
//             <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
//                 <div>
//                     <h1 className='text-2xl font-bold'>Job<span className='text-[#F83002]'>Portal</span></h1>
//                 </div>
//                 <div className='flex items-center gap-12'>
//                     <ul className='flex font-medium items-center gap-5'>
//                         {
//                             user && user.role === 'recruiter' ? (
//                                 <>
//                                     <li><Link to="/admin/companies">Companies</Link></li>
//                                     <li><Link to="/admin/jobs">Jobs</Link></li>
//                                 </>
//                             ) : (
//                                 <>
//                                     <li><Link to="/alerts">Alerts</Link></li>
//                                     <li><Link to="/">Home</Link></li>
//                                     <li><Link to="/jobs">Jobs</Link></li>
//                                     <li><Link to="/browse">Browse</Link></li>
//                                 </>
//                             )
//                         }

//                     </ul>
//                     {
//                         !user ? (
//                             <div className='flex items-center gap-2'>
//                                 <Link to="/login"><Button variant="outline">Login</Button></Link>
//                                 <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
//                             </div>
//                         ) : (
//                             <Popover>
//                                 <PopoverTrigger asChild>
//                                     <Avatar className="cursor-pointer">
//                                         <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
//                                     </Avatar>
//                                 </PopoverTrigger>
//                                 <PopoverContent className="w-80">
//                                     <div className=''>
//                                         <div className='flex gap-2 space-y-2'>
//                                             <Avatar className="cursor-pointer">
//                                                 <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
//                                             </Avatar>
//                                             <div>
//                                                 <h4 className='font-medium'>{user?.fullname}</h4>
//                                                 <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
//                                             </div>
//                                         </div>
//                                         <div className='flex flex-col my-2 text-gray-600'>
//                                             {
//                                                 user && user.role === 'student' && (
//                                                     <div className='flex w-fit items-center gap-2 cursor-pointer'>
//                                                         <User2 />
//                                                         <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
//                                                     </div>
//                                                 )
//                                             }

//                                             <div className='flex w-fit items-center gap-2 cursor-pointer'>
//                                                 <LogOut />
//                                                 <Button onClick={logoutHandler} variant="link">Logout</Button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </PopoverContent>
//                             </Popover>
//                         )
//                     }

//                 </div>
//             </div>

//         </div>
//     )
// }

// export default Navbar

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2, CalendarDays } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
// import InterviewCalendar from "../InterviewCalendar"; // ✅ Importing Calendar
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"; // ✅ Importing Modal Components

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // ✅ State for modal

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/job/getNotifications",
          { withCredentials: true }
        );
        setNotificationCount(res.data.notifications.length);
      } catch (error) {
        console.error(
          "Error fetching notifications:",
          error.response?.data?.message || error.message
        );
      }
    };
    fetchNotifications();
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="bg-white shadow-md">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-6">
      <Link to="/"><motion.h1 className="text-2xl font-bold" whileHover={{ scale: 1.1 }}>
          {/* Hire<span className="text-[#F83002]">Nest</span> */}
          Hire<span className="text-black">Nest</span>
        </motion.h1></Link>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <motion.li whileHover={{ scale: 1.1 }}>
                  <Link to="/admin/companies">Companies</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }}>
                  <Link to="/admin/jobs">Jobs</Link>
                </motion.li>
              </>
            ) : (
              <>
                <motion.li whileHover={{ scale: 1.1 }}>
                  <Link to="/alerts">
                    Alerts{" "}
                    {notificationCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                </motion.li>
                {/* <motion.li whileHover={{ scale: 1.1 }}>
                  <Link to="/">Home</Link>
                </motion.li> */}
                <motion.li whileHover={{ scale: 1.1 }}>
                  <Link to="/jobs">Jobs</Link>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }}>
                  <Link to="/browse">Browse</Link>
                </motion.li>
                {/* ✅ Interview Scheduling button (opens modal) */}
                <motion.li whileHover={{ scale: 1.1 }}>
                  <button
                    onClick={() => setIsCalendarOpen(true)}
                    className="flex items-center gap-1"
                  >
                    <CalendarDays className="w-5 h-5" />
                     Scheduled Dates 
                  </button>
                </motion.li>
                <motion.li whileHover={{ scale: 1.1 }}>
                  <Link to="/alumini">Alumini</Link>
                </motion.li>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/signup">
                  <Button className="bg-[#219C90] hover:bg-[#219C90]">
                    Signup
                  </Button>
                </Link>
              </motion.div>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt="User Profile"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div>
                  <div className="flex gap-2 space-y-2">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="User Profile"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.fullname}</h4>
                      <p className="text-sm text-gray-500">
                        {user?.profile?.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    {user && user.role === "student" && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex w-fit items-center gap-2 cursor-pointer"
                      >
                        <User2 />
                        <Button variant="link">
                          <Link to="/profile">View Profile</Link>
                        </Button>
                      </motion.div>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex w-fit items-center gap-2 cursor-pointer"
                    >
                      <LogOut />
                      <Button onClick={logoutHandler} variant="link">
                        Logout
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* ✅ Modal for Interview Calendar */}
      {/* <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Interview Scheduled</DialogTitle>
            <DialogClose asChild>
              <Button
                className="absolute right-2 top-2"
                variant="ghost"
                onClick={() => setIsCalendarOpen(false)}
              >
            
              </Button>
            </DialogClose>
          </DialogHeader>
        //   <InterviewCalendar />
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default Navbar;