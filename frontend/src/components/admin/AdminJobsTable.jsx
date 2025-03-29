// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { Avatar, AvatarImage } from "../ui/avatar";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Edit2, Eye, MoreHorizontal } from "lucide-react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const AdminJobsTable = () => {
//   const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

//   const [filterJobs, setFilterJobs] = useState(allAdminJobs);
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("called");
//     const filteredJobs = allAdminJobs.filter((job) => {
//       if (!searchJobByText) {
//         return true;
//       }
//       return (
//         job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
//         job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
//       );
//     });
//     setFilterJobs(filteredJobs);
//   }, [allAdminJobs, searchJobByText]);
//   return (
//     <div>
//       <Table>
//         <TableCaption>A list of your recent posted jobs</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Company Name</TableHead>
//             <TableHead>Role</TableHead>
//             <TableHead>Date</TableHead>
//             <TableHead className="text-right">Action</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {filterJobs?.map((job) => (
//             <tr>
//               <TableCell>{job?.company?.name}</TableCell>
//               <TableCell>{job?.title}</TableCell>
//               <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
//               <TableCell className="text-right cursor-pointer">
//                 <Popover>
//                   <PopoverTrigger>
//                     <MoreHorizontal />
//                   </PopoverTrigger>
//                   <PopoverContent className="w-32">
//                     <div
//                       onClick={() => navigate(`/admin/companies/${job._id}`)}
//                       className="flex items-center gap-2 w-fit cursor-pointer"
//                     >
//                       <Edit2 className="w-4" />
//                       <span>Edit</span>
//                     </div>
//                     {/* <div onClick={()=> navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
//                                                 <Eye className='w-4'/>
//                                                 <span>Applicants</span>
//                                             </div> */}
//                     <div
//                       onClick={() =>
//                         navigate(`/admin/jobs/${job._id}/applicants`, {
//                           state: { role: job.title },
//                         })
//                       }
//                       className="flex items-center w-fit gap-2 cursor-pointer mt-2"
//                     >
//                       <Eye className="w-4" />
//                       <span>Applicants</span>
//                     </div>

//                     <div
//                       onClick={() =>
//                         navigate(`/admin/jobs/${job._id}/applicants`)
//                       }
//                       className="flex items-center w-fit gap-2 cursor-pointer mt-2"
//                     >
//                       <Eye className="w-4" />
//                       <span>Remove</span>
//                     </div>
//                   </PopoverContent>
//                 </Popover>
//               </TableCell>
//             </tr>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default AdminJobsTable;



import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react"; // Added Trash2 for delete icon
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner'
import { JOB_API_END_POINT } from "@/utils/constant";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  // Delete job function
  const deleteJob = async (jobId) => {
    // console.log("Job ID:", jobId);
    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        console.error("No authentication token found!");
        return;
      }
  
      const res = await axios.delete(
        `http://localhost:8000/api/v1/job/delete/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token in headers
          },
          withCredentials: true, // ✅ Ensure cookies are sent
        }
      );
      if(res.data.success){
        toast.success(res.data.message);
        navigate("/admin/jobs");
    }
  
      console.log(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  
  

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.map((job) => (
            <TableRow key={job._id}>
              <TableCell>{job?.company?.name}</TableCell>
              <TableCell>{job?.title}</TableCell>
              <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() => navigate(`/admin/companies/${job._id}`)}
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/${job._id}/applicants`, {
                          state: { role: job.title },
                        })
                      }
                      className="flex items-center w-fit gap-2 cursor-pointer mt-2"
                    >
                      <Eye className="w-4" />
                      <span>Applicants</span>
                    </div>
                    <div
                      onClick={() => deleteJob(job._id)}
                      className="flex items-center w-fit gap-2 cursor-pointer mt-2 text-red-500"
                    >
                      <Trash2 className="w-4" />
                      <span>Remove</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;

