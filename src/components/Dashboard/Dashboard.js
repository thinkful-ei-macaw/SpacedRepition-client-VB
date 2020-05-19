import React from "react";
import Config from "../../config";
import TokenService from "../../services/token-service";
import { Link } from "react-router-dom";
export default class Dashboard extends React.Component {
  state = {
    language: [],
    words: [],
  };

  componentDidMount() {
    console.log("hello");
    fetch(`${Config.API_ENDPOINT}/language`, {
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((e) => Promise.reject(e));
        }
        console.log("in promise1");
        return res.json();
      })
      .then((data) => {
        console.log("this is the ressss", data);
        //update state here
        this.setState({ language: data.language, words: data.words });
      })
      .catch((error) => console.log(error));
  }

  render() {
    console.log(this.state.language);
    const wordings = this.state.words.map((x, id) => {
      return (
        <li key={id}>
          {x.original} Correct: {x.correct_count} Wrong: {x.incorrect_count}
        </li>
      );
    });
    return (
      <div>
        <h2 className="dash-title">
          Dashboard
          {this.state.language.name} Total Correct{" "}
          <span>{this.state.language.total_score}</span>
          <Link className="link" to="/learn" style={{ textDecoration: "none" }}>
            Start Learning
          </Link>
        </h2>
        <ul>{wordings}</ul>
        <br />
      </div>
    );
  }
}
