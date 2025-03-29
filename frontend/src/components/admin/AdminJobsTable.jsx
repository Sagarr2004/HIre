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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
            Authorization: ` Bearer ${token}`, // ✅ Send token in headers
          },
          withCredentials: true, // ✅ Ensure cookies are sent
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }

      console.log(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-6 overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Recent Job Postings
        </h2>
        <Table className="w-full border rounded-lg overflow-hidden">
          <TableCaption className="text-gray-600 py-2">
            Manage your job postings effectively
          </TableCaption>
          <TableHeader className="bg-gradient-to-r  text-white">
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterJobs?.map((job) => (
              <TableRow
                key={job._id}
                className="hover:bg-gray-50 transition-all duration-300"
              >
                <TableCell className="py-3 px-4 font-medium">
                  {job?.company?.name}
                </TableCell>
                <TableCell className="py-3 px-4">{job?.title}</TableCell>
                <TableCell className="py-3 px-4">
                  {job?.createdAt.split("T")[0]}
                </TableCell>
                <TableCell className="py-3 px-4 text-right">
                  <Popover>
                    <PopoverTrigger className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition">
                      <MoreHorizontal className="text-gray-700" />
                    </PopoverTrigger>
                    <PopoverContent className="w-36 bg-white shadow-lg rounded-lg p-2">
                      <div
                        onClick={() => navigate(`/admin/companies/${job._id}`)}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-4 text-blue-500" />
                        <span>Edit</span>
                      </div>
                      <div
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`, {
                            state: { role: job.title },
                          })
                        }
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        <Eye className="w-4 text-green-500" />
                        <span>Applicants</span>
                      </div>
                      <div
                        onClick={() => deleteJob(job._id)}
                        className="flex items-center gap-2 p-2 hover:bg-red-100 rounded-lg cursor-pointer text-red-500"
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
    </div>
  );
};

export default AdminJobsTable;