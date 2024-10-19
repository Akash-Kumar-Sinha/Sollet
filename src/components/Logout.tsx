import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";

import {
  MEMONICS_PHRASE_CIPHERTEXT,
  PASSWORD_CIPHERTEXT,
  SECRET_KEY_CIPHERTEXT,
} from "@/types/type";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      localStorage.removeItem(MEMONICS_PHRASE_CIPHERTEXT);
      localStorage.removeItem(PASSWORD_CIPHERTEXT);

      const storedKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith(SECRET_KEY_CIPHERTEXT)
      );
      for (const storedKey of storedKeys) {
        localStorage.removeItem(storedKey);
      }

      navigate("/");
    } catch {
      console.log("Error removing items from local storage");
    }
  };
  return (
    <div onClick={handleLogout} className="flex items-center gap-3">
      Logout{" "}
      <span className="font-bold">
        <CiLogout />
      </span>{" "}
    </div>
  );
};

export default Logout;
