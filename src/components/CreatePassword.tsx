import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePassword = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleNext = () => {
    if (password === confirmPassword && isChecked) {
      navigate("/wallet");
    } else if (!isChecked) {
      alert("Please agree to the terms and conditions.");
    } else if (password !== confirmPassword) {
      alert("Passwords do not match.");
    }
  };

  return (
    <div className="h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] w-full max-w-lg text-[#f8f8f2] rounded-lg shadow-lg p-6 md:p-8 lg:p-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#8e44ad] mb-6">
          Create Password
        </h1>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#2a2a2a] border-2 border-[#00f0ff] text-[#f8f8f2] p-3 rounded-lg w-full text-sm md:text-base mb-3"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-[#2a2a2a] border-2 border-[#00f0ff] text-[#f8f8f2] p-3 rounded-lg w-full text-sm md:text-base"
          />
        </div>
        <div className="flex items-center justify-center mb-6">
          <input
            type="checkbox"
            id="agree-terms"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label
            htmlFor="agree-terms"
            className="text-gray-400 text-sm md:text-base"
          >
            I agree to the terms and conditions
          </label>
        </div>
        <button
          onClick={handleNext}
          className="bg-[#8e44ad] text-[#121212] font-semibold py-2 px-4 md:py-3 md:px-6 rounded-full shadow-md hover:bg-[#00c0cc] transition duration-300 text-sm md:text-base"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CreatePassword;
