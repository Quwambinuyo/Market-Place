import React from "react";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";

function Profile() {
  const auth = getAuth();
  useEffect(() => {
    setUser(auth.currentUser);
  }, []);
  const [user, setUser] = useState(null);

  return user ? <h1>{user.displayName} </h1> : "not Logged in";
}

export default Profile;
