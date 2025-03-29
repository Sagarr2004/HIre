import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';
import { Search } from 'lucide-react'; // ✅ Importing search icon

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

         

            {/* Content Container */}
            <div className="max-w-6xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
                {/* Search & Button Section */}
                <div className="flex items-center justify-between mb-6">
                    
                    {/* Search Input with Icon */}
                    <div className="relative w-1/3">
                        <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
                        <Input
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                            placeholder="Search by company name..."
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    {/* New Company Button */}
                    <Button 
                        className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                        onClick={() => navigate("/admin/companies/create")}
                    >
                        + Add New Company
                    </Button>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-lg shadow bg-white p-4 border border-gray-200">
                    <CompaniesTable />
                </div>
            </div>
        </div>
    );
};

export default Companies;