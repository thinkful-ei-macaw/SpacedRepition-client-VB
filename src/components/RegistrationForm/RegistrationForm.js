import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Input, Required, Label } from "../Form/Form";
import AuthApiService from "../../services/auth-api-service";
import Button from "../Button/Button";
import "./RegistrationForm.css";

class RegistrationForm extends Component {
  static defaultProps = {
    onRegistrationSuccess: () => {},
  };

  state = { error: null };

  firstInput = React.createRef();

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { name, username, password } = ev.target;
    AuthApiService.postUser({
      name: name.value,
      username: username.value,
      password: password.value,
    })
      .then((user) => {
        name.value = "";
        username.value = "";
        password.value = "";
        this.props.onRegistrationSuccess();
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  componentDidMount() {
    this.firstInput.current.focus();
  }

  render() {
    let label1 = Label(
      { or: "registration-name-input" },
      "name",
      "Enter your name"
    );
    let label2 = Label(
      { className: "registration-username-input" },
      "username",
      "Choose username"
    );
    let label3 = Label(
      { className: "registration-password-input" },
      "password",
      "Choose password"
    );
    let requiredLabel = Required({});
    // let requiredLabel = Required({});
    // let requiredLabel = Required({});
    const { error } = this.state;
    return (
      <form className="signup-form" onSubmit={this.handleSubmit}>
        <div role="alert">{error && <p>{error}</p>}</div>
        <div>
          <label htmlFor="registration-name-input">
            Enter your name
            <Required />
          </label>
          <Input
            ref={this.firstInput}
            id="registration-name-input"
            name="name"
            required
          />
          {requiredLabel}
        </div>
        <div>
          <label htmlFor="registration-username-input">
            Choose a username
            <Required />
          </label>
          <Input id="registration-username-input" name="username" required />
          {requiredLabel}
        </div>
        <div>
          <label htmlFor="registration-password-input">
            Choose a password
            <Required />
          </label>
          <Input
            id="registration-password-input"
            name="password"
            type="password"
            required
          />
          {requiredLabel}
        </div>
        <footer>
          <div>
            <Button type="submit">Sign up</Button>{" "}
          </div>
          <div>
            <Link
              className="already"
              to="/login"
              style={{ textDecoration: "none" }}
            >
              Already have an account?
            </Link>
          </div>
        </footer>
      </form>
    );
  }
}

export default RegistrationForm;
