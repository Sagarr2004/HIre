import { useState } from "react";

const RecruiterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    skills: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      skills: formData.skills.split(",").map((s) => s.trim()),
    };

    try {
      const response = await fetch("http://localhost:8000/api/recruiters/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Recruiter data submitted successfully!");
        setFormData({ name: "", domain: "", skills: "" });
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
      <h2 className="text-2xl font-semibold text-center mb-4">Recruiter Portal Form</h2>
      {message && <p className="text-center text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Recruiter Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="domain" placeholder="Domain" value={formData.domain} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
      </form>
    </div>
  );
};

export default RecruiterForm;
