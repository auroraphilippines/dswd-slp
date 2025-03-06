import { Facebook, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export default function Signin({ isSignUp, toggleForm }) {
  return (
    <>
      <div
        className={`container b-container ${isSignUp ? "is-txl is-z200" : ""}`}
        id="b-container"
      >
        <form className="form" id="b-form">
          <div className="form-logo">
            <Image
              src="/images/SLP.png"
              alt="SLP Logo"
              width={80}
              height={80}
              className="main-logo"
            />
          </div>
          <h2 className="form_title title">Sign in to Website</h2>
          <div className="form__icons">
            <Facebook className="form__icon" size={24} />
            <Linkedin className="form__icon" size={24} />
            <Twitter className="form__icon" size={24} />
          </div>
          <span className="form__span">or use your email account</span>
          <input type="text" className="form__input" placeholder="Email" />
          <input
            type="password"
            className="form__input"
            placeholder="Password"
          />
          <a className="form__link">Forgot your password?</a>
          <button className="form__button button submit">SIGN IN</button>
        </form>
      </div>

      <div
        className={`switch__container ${isSignUp ? "is-hidden" : ""}`}
        id="switch-c1"
      >
        <div className="logo-container">
          <Image
            src="/images/SLP.png"
            alt="SLP Logo"
            width={60}
            height={60}
            className="switch-logo"
          />
        </div>
        <h2 className="switch__title title">Welcome Back !</h2>
        <p className="switch__description description">
          To keep connected with us please login with your personal info
        </p>
        <button
          className="switch__button button switch-btn"
          onClick={toggleForm}
        >
          SIGN IN
        </button>
      </div>
    </>
  );
}
