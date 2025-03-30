import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector((store) => store.application) || { applicants: { applications: [] } };
    const [resumeLinks, setResumeLinks] = useState([]);
    const [mlResponse, setMlResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState("1");
    const [isOpen, setIsOpen] = useState(false);
    const [interviewers, setInterviewers] = useState([]);
    const [error, setError] = useState(null);

    const skills = [
        "cloud infrastructure", "microservices architecture", "Google Cloud Platform (GCP)", "Azure",
        "CI/CD pipelines", "cloud-native solutions", "cloud migration", "JavaScript",
        "Google Cloud Armor", "containerization technologies"
    ];

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.error('Error fetching applicants:', error);
            }
        };

        const processResumes = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants/resume`, { withCredentials: true });
                if (res.data.success && Array.isArray(res.data.resumes)) {
                    const formData = new FormData();
                    formData.append("job_description", "We are seeking a highly skilled Full-Stack Developer...");
                    
                    const resumeUrls = [];
                    for (const applicant of res.data.resumes) {
                        if (applicant.resumeLink) {
                            try {
                                const response = await axios.get(applicant.resumeLink, { responseType: 'blob' });
                                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                                formData.append("files", new File([pdfBlob], `${applicant.name}.pdf`, { type: 'application/pdf' }));
                                resumeUrls.push({ name: applicant.name, url: URL.createObjectURL(pdfBlob) });
                            } catch (err) {
                                console.error(`Failed to download resume for ${applicant.name}:`, err);
                            }
                        }
                    }
                    setResumeLinks(resumeUrls);
                    
                    const mlRes = await axios.post("http://localhost:5000/upload", formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                    setMlResponse(mlRes.data.ranked_resumes || []);
                }
            } catch (error) {
                console.error("Error processing resumes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllApplicants();
        processResumes();
    }, [params.id, dispatch]);

    const sendData = async (option) => {
        setLoading(true);
        setError(null);

        const payload = {
            option,
            skills,
        };

        console.log("Payload:",payload);

        try {
            const res = await axios.post("http://localhost:5001/process", payload, {
                headers: { "Content-Type": "application/json" },
            });
            setInterviewers(res.data.interviewers || []);
        } catch (error) {
            setError("Failed to connect to the backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mt-[10px] mx-auto">
                <h1 className="font-bold text-xl mb-4">Applicants {applicants?.applications?.length || 0}</h1>
                {loading && <p className="text-blue-500">Processing resumes...</p>}
                {resumeLinks.length > 0 && (
                    <div className="mt-4 p-4 border rounded-lg">
                        <h2 className="font-bold">Downloaded Resumes:</h2>
                        <ul>
                            {resumeLinks.map((applicant, index) => (
                                <li key={index}>
                                    {applicant.name}: {" "}
                                    <a href={applicant.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        View Resume
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {mlResponse && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-100 mb-[40px]">
                        <h2 className="font-bold">Shortlisted Candidates:</h2>
                        <ul>
                            {mlResponse.map((applicant, index) => (
                                <li key={index} className="py-2">
                                    <span className="font-semibold">{applicant.filename}%</span>: {" "}
                                    <span className="text-green-600 font-bold">{applicant.match_score}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <ApplicantsTable />

                <div className="relative inline-block text-left mt-4">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {selected ? `Selected: ${selected}` : "Select no of experts in Panel"}
                    </button>
                    {isOpen && (
                        <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                            {["1", "2", "3", "4", "5"].map((num) => (
                                <div
                                    key={num}
                                    onClick={() => {
                                        setSelected(num);
                                        sendData(num);
                                        setIsOpen(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 mb-10">
                    <h2 className="text-xl font-semibold mb-2">Ranked Interviewers</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    {interviewers.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {interviewers.map((name, index) => (
                                <li key={index} className="text-gray-700">{index + 1}. {name}</li>
                            ))}
                        </ul>
                    ) : (
                        !loading && <p className="text-gray-500">No interviewers found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Applicants;
