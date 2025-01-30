import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = () => {};

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back</p>
        </header>

        <main>
          <form>
            <input
              type="email"
              placeholder="Email"
              className="emailInput"
              id="email"
              value={email}
              onChange={onChange}
            />
          </form>
        </main>
      </div>
    </>
  );
}

export default SignIn;
