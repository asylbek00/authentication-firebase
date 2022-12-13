import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { secretkey } from "../../utils/constants";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const navigate = useNavigate();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  function submitHandler(e) {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";

    if (isLogin) {
      fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${secretkey}`,
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: { "Content-type": "application/json" },
        }
        
      ).then((response) => {
        if (response.ok) {
          console.log(response);
          navigate("/profile");
        } else {
          response.json().then((responseData) => {
            let errorMessage = "Authentication is failed";
            if (responseData.error && responseData.error.message) {
              errorMessage = responseData.error.message;
            }
            alert(errorMessage);
          });
        }
      });

      //_______________________________________________________
    } else {
      fetch(
        `  https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${secretkey}`,
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: { "Content-type": "application/json" },
        }
      ).then((response) => {
        if (response.ok) {
          console.log(response);
          navigate("/profile");
        } else {
          response.json().then((responseData) => {
            let errorMessage = "Authentication is failed";
            if (responseData.error && responseData.error.message) {
              errorMessage = responseData.error.message;
            }
            alert(errorMessage);
          });
        }
      });
    }
    // <Navigate to="/profile" />;
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" ref={emailInputRef} id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            ref={passwordInputRef}
            id="password"
            required
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
