import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate(); // ✅ Correct usage

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.displayName,
  });

  const onLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type="button" onClick={onLogout}>
          Log Out
        </button>
      </header>
    </div>
  );
}

export default Profile;
