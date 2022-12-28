import "./Login.scss";
import React, { useRef, useState } from "react";

import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCancel, MdOutlineCancelPresentation } from "react-icons/md";
import axios from "axios";

const Login = ({ setShowLogin, myStorage, setCurrentUsername }) => {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("http://localhost:3000/users/login", user);
      myStorage.setItem("user", res.data.username);
      setCurrentUsername(res.data.username);
      setShowLogin(false);
      setError(false);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div>
      <div className="login_Container">
        <div className="logo">
          <FaMapMarkerAlt className="Pin_logo" />
          Login_Now
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" ref={nameRef}></input>
          <input
            type="password"
            placeholder="password"
            ref={passwordRef}
          ></input>
          <button className="loginBtn">Login</button>

          {error && <span className="faliure">Somthing Went Wrong</span>}
        </form>{" "}
        <MdCancel
          className="login_cancel_button"
          onClick={() => setShowLogin(false)}
        />
      </div>
    </div>
  );
};

export default Login;
