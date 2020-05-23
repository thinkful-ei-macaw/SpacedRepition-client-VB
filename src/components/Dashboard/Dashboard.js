import React from "react";
import Config from "../../config";
import TokenService from "../../services/token-service";
import { Link } from "react-router-dom";
import "./Dashboard.css";
export default class Dashboard extends React.Component {
  state = {
    language: [],
    words: [],
  };

  componentDidMount() {
    fetch(`${Config.API_ENDPOINT}/language`, {
      headers: {
        authorization: `Bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((e) => Promise.reject(e));
        }
        return res.json();
      })
      .then((data) => {
        //update state here
        this.setState({ language: data.language, words: data.words });
      })
      .catch((error) => console.log(error));
  }

  render() {
    const wordings = this.state.words.map((x, id) => {
      return (
        <li className="remove-bullet" key={id}>
          <h4 className="fit original-word">{x.original}</h4>
          <span className="correct fit">
            correct answer count: {x.correct_count}
          </span>{" "}
          <span className="wrong fit">
            incorrect answer count: {x.incorrect_count}
          </span>
        </li>
      );
    });
    return (
      <div>
        <h2>
          <div className="main-title">
            <span className="dash-title">Dashboard</span>
            <span className="lang-title">{this.state.language.name}</span>
          </div>
          <div>
            <section className="total-title">
              Total correct answers: {this.state.language.total_score}
            </section>
          </div>
          <div>
            <Link
              className="link total-title start-btn"
              to="/learn"
              style={{ textDecoration: "none" }}
            >
              Start practicing
            </Link>
          </div>
        </h2>
        <h3 className="center">Words to practice</h3>
        <ul class="center">{wordings}</ul>
        <br />
      </div>
    );
  }
}
