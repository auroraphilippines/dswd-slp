import { Facebook, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export default function Signup({ isSignUp, toggleForm }) {
  return (
    <>
      <div
        className={`container a-container ${isSignUp ? "is-txl" : ""}`}
        id="a-container"
      >
        <form className="form" id="a-form">
          <div className="form-logo">
            <Image
              src="/images/SLP.png"
              alt="SLP Logo"
              width={80}
              height={80}
              className="main-logo"
            />
          </div>
          <h2 className="form_title title">Create Account</h2>
          <div className="form__icons">
            <Facebook className="form__icon" size={24} />
            <Linkedin className="form__icon" size={24} />
            <Twitter className="form__icon" size={24} />
          </div>
          <span className="form__span">or use email for registration</span>
          <input type="text" className="form__input" placeholder="Name" />
          <input type="text" className="form__input" placeholder="Email" />
          <input
            type="password"
            className="form__input"
            placeholder="Password"
          />
          <button className="form__button button submit">SIGN UP</button>
        </form>
      </div>

      <div
        className={`switch__container ${isSignUp ? "" : "is-hidden"}`}
        id="switch-c2"
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
        <h2 className="switch__title title">Hello Friend !</h2>
        <p className="switch__description description">
          Enter your personal details and start journey with us
        </p>
        <button
          className="switch__button button switch-btn"
          onClick={toggleForm}
        >
          SIGN UP
        </button>
      </div>
    </>
  );
}
