import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const nameInputRef = useRef(null);

  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData({
          name: user.displayName || "",
          email: user.email || "",
        });
      } else {
        navigate("/sign-in");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const { name, email } = formData;

  const onLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type="button" onClick={onLogout}>
          Log Out
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              if (changeDetails) {
                onSubmit();
                nameInputRef.current.blur();
              }
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              ref={nameInputRef}
              value={name}
              onChange={onChange}
            />
            <input
              type="email"
              id="email"
              className="profileEmail"
              disabled
              value={email}
            />
          </form>
        </div>

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
      </main>
    </div>
  );
}

export default Profile;
