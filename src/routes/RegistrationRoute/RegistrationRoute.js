import React, { Component } from "react";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";

class RegistrationRoute extends Component {
  static defaultProps = {
    history: {
      push: () => {},
    },
  };

  handleRegistrationSuccess = () => {
    const { history } = this.props;
    history.push("/login");
  };

  render() {
    return (
      <section>
        <p className="app-desc">
          Practice learning a language with the spaced reptition revision
          technique.
        </p>
        <h2 className="signup-header">Sign up</h2>
        <RegistrationForm
          onRegistrationSuccess={this.handleRegistrationSuccess}
        />
      </section>
    );
  }
}

export default RegistrationRoute;
