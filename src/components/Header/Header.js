import React, { Component } from "react";
import { Link } from "react-router-dom";
import TokenService from "../../services/token-service";
import UserContext from "../../contexts/UserContext";
import "./Header.css";

class Header extends Component {
  static contextType = UserContext;

  handleLogoutClick = () => {
    this.context.processLogout();
  };

  renderLogoutLink() {
    return (
      <div>
        <span className="centered">{this.context.user.name}</span>
        <nav>
          <Link
            onClick={this.handleLogoutClick}
            to="/login"
            style={{ textDecoration: "none" }}
          >
            Logout
          </Link>
        </nav>
      </div>
    );
  }

  renderLoginLink() {
    return (
      <nav>
        <Link className="link" to="/login" style={{ textDecoration: "none" }}>
          Login
        </Link>{" "}
        <Link
          className="link"
          style={{ textDecoration: "none" }}
          to="/register"
        >
          Sign up
        </Link>
      </nav>
    );
  }

  render() {
    return (
      <header>
        <h1>
          <Link className="home" to="/" style={{ textDecoration: "none" }}>
            Spaced repetition
          </Link>
        </h1>
        {TokenService.hasAuthToken()
          ? this.renderLogoutLink()
          : this.renderLoginLink()}
      </header>
    );
  }
}

export default Header;
