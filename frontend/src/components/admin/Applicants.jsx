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
    const [pdfFiles, setPdfFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mlResponse, setMlResponse] = useState(null);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.error('Error fetching applicants:', error);
            }
        };
        fetchAllApplicants();
    }, [params.id, dispatch]);

    const handleCollectResumes = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants/resume`, { withCredentials: true });

            if (res.data.success && Array.isArray(res.data.resumes)) {
                const downloadedFiles = [];
                const resumeUrls = [];

                for (const applicant of res.data.resumes) {
                    if (applicant.resumeLink) {
                        try {
                            const response = await axios.get(applicant.resumeLink, { responseType: 'blob' });
                            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                            const objectUrl = URL.createObjectURL(pdfBlob);

                            downloadedFiles.push(new File([pdfBlob], `${applicant.name}.pdf`, { type: 'application/pdf' }));
                            resumeUrls.push({ name: applicant.name, url: objectUrl });
                        } catch (err) {
                            console.error(`Failed to download resume for ${applicant.name}:`, err);
                        }
                    }
                }

                setPdfFiles(downloadedFiles);
                setResumeLinks(resumeUrls);
            } else {
                console.warn("No resumes found in response.");
            }
        } catch (error) {
            console.error("Error collecting resumes:", error);
        }
    };

    const handleSendToModel = async () => {
        if (pdfFiles.length === 0) {
            console.warn("No resumes available to send. Collect resumes first.");
            return;
        }
    
        setLoading(true);
        const formData = new FormData();
        formData.append("job_description", "We are seeking a highly skilled Full-Stack Developer with expertise in C++, Python, JavaScript, React, HTML, and CSS to develop and optimize dynamic web applications. The ideal candidate will have experience working with MongoDB and SQL databases for efficient data management. You will be responsible for designing, developing, and maintaining scalable front-end and back-end solutions, ensuring seamless user experiences. Strong problem-solving abilities and a passion for clean, efficient code are essential.");
        pdfFiles.forEach((pdf) => {
            formData.append("files", pdf);
        });
    
        try {
            const res = await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
    
            if (res.data && Array.isArray(res.data.ranked_resumes)) {
                setMlResponse(res.data.ranked_resumes);
            } else {
                console.error("Unexpected ML response format:", res.data);
                setMlResponse([]);
            }
        } catch (error) {
            console.error("Error sending files to ML model:", error.response?.data || error.message);
            setMlResponse([]);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mt-[10px] mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="font-bold text-xl">
                        Applicants {Array.isArray(applicants?.applications) ? applicants.applications.length : 0}
                    </h1>

                    <div>
                        <button 
                            onClick={handleCollectResumes} 
                            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                        >
                            Collect Resumes
                        </button>
                        <button 
                            onClick={handleSendToModel} 
                            className="bg-green-500 text-white py-2 px-4 rounded"
                            disabled={pdfFiles.length === 0 || loading} 
                        >
                            {loading ? "Sending..." : "Send to Model"}
                        </button>
                    </div>

                </div>

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
                        <h2 className="font-bold">Ranking Scores:</h2>
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
            </div>
        </div>
    );
};

export default Applicants;