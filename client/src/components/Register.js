import "./Register.scss";
import React, { useRef, useState } from "react";

import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCancel, MdOutlineCancelPresentation } from "react-icons/md";
import axios from "axios";

const Register = ({ setShowRegister }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("http://localhost:3000/users/register", newUser);
      setError(false);
      setSuccess(true);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div>
      <div className="register_Container">
        <div className="logo">
          <FaMapMarkerAlt className="Pin_logo" />
          Register_Now
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" ref={nameRef}></input>
          <input type="email" placeholder="email" ref={emailRef}></input>
          <input
            type="password"
            placeholder="password"
            ref={passwordRef}
          ></input>
          <button className="registerBtn">Register</button>
          {success && (
            <span className="success">SuccessFull, You can Login_Now</span>
          )}
          {error && <span className="faliure">Somthing Went Wrong</span>}
        </form>{" "}
        <MdCancel
          className="register_cancel_button"
          onClick={() => setShowRegister(false)}
        />
      </div>
    </div>
  );
};

export default Register;
