import { useState } from "react";

const AlumniForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentCompany: "",
    previousCompanies: "",
    linkedIn: "",
    github: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert previousCompanies into an array
    const formattedData = { 
      ...formData, 
      previousCompanies: formData.previousCompanies.split(",").map((c) => c.trim()) 
    };

    try {
      const response = await fetch("http://localhost:8000/api/alumni/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Alumni data submitted successfully!");
        setFormData({
          name: "",
          email: "",
          currentCompany: "",
          previousCompanies: "",
          linkedIn: "",
          github: "",
        });
      } else {
        setMessage(data.message || "Error submitting form.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("Server error, please try again later.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-center mb-4">Alumni Portal Form</h2>
      {message && <p className="text-center text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Name of Alumni" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="currentCompany" placeholder="Current Working Company" value={formData.currentCompany} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="previousCompanies" placeholder="Previously Working Companies (comma-separated)" value={formData.previousCompanies} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="url" name="linkedIn" placeholder="LinkedIn Profile" value={formData.linkedIn} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="url" name="github" placeholder="GitHub Profile" value={formData.github} onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
      </form>
    </div>
  );
};

export default AlumniForm;