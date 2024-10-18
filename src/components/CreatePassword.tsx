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
    <div className="h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md text-black text-center rounded-lg shadow-lg p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#8e44ad] mb-6">
          Create Password
        </h1>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-200 border border-fuchsia-500 text-black p-3 rounded-md w-full text-sm md:text-base mb-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-zinc-200 border border-fuchsia-500 text-black p-3 rounded-md w-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>

        <div className="flex items-center justify-center mb-6">
          <input
            type="checkbox"
            id="agree-terms"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mr-2 accent-fuchsia-500"
          />
          <label
            htmlFor="agree-terms"
            className="text-gray-500 text-sm md:text-base"
          >
            I agree to the terms and conditions
          </label>
        </div>

        <button
          onClick={handleNext}
          className="bg-fuchsia-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-[#8e44ad] transition duration-300 ease-in-out"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CreatePassword;
