import React from "react";
import { Label, Input, Required } from "../Form/Form";
import Config from "../../config";
import TokenService from "../../services/token-service";
import "./LearningPage.css";
export default class LearningPage extends React.Component {
  constructor(props) {
    super(props);
    this.userInput = React.createRef();
  }
  state = {
    currentWord: "",
    nextWord: "",
    totalScore: 0,
    wordCorrectCount: 0,
    wordIncorrectCount: 0,
    answer: "",
    isCorrect: false,
    btnClicked: false,
    userInput: "",
  };

  componentDidMount() {
    fetch(`${Config.API_ENDPOINT}/language/head`, {
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
        this.setState({
          currentWord: data.currentWord,
          nextWord: data.nextWord,
          totalScore: data.totalScore,
          wordCorrectCount: data.wordCorrectCount,
          wordIncorrectCount: data.wordIncorrectCount,
        });
      })
      .catch((error) => console.log(error));
  }

  submitGuess = (e) => {
    e.preventDefault();
    let value = this.state.userInput;
    fetch(`${Config.API_ENDPOINT}/language/guess`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify({ guess: value }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((word) => {
        this.setState({
          currentWord: word.currentWord,
          nextWord: word.nextWord,
          totalScore: word.totalScore,
          wordCorrectCount: word.wordCorrectCount,
          wordIncorrectCount: word.wordIncorrectCount,
          isCorrect: word.isCorrect,
          answer: word.answer,
          btnClicked: true,
        });
      })
      .catch((err) => console.log(err));
  };

  nextWord = (e) => {
    e.preventDefault();
    this.setState({
      currentWord: this.state.nextWord,
      btnClicked: false,
      userInput: "",
    });
  };

  inputChanged = (e) => {
    this.setState({
      userInput: e.target.value,
    });
  };

  score() {
    return (
      <p className="DisplayScore">
        `Your total score is: {this.state.totalScore}``
      </p>
    );
  }

  render() {
    let label = Label(
      { for: "learn-guess-input" },
      "answer",
      "Provide answer here"
    );
    let requiredLabel = Required({});

    let score = this.score();

    return (
      <div>
        <form onSubmit={this.submitGuess}>
          <fieldset>
            <legend className="legend-title">Learn the word</legend>
            <div className="DisplayScore">
              <p>Your total score is: {this.state.totalScore}</p>
            </div>
            <p>
              You have answered this word correctly{" "}
              {this.state.wordCorrectCount} times.
            </p>
            <p>
              You have answered this word incorrectly{" "}
              {this.state.wordIncorrectCount} times.
            </p>

            {this.state.btnClicked ? (
              <div className="DisplayFeedback">
                <p>
                  The correct translation for {this.state.currentWord} was{" "}
                  {this.state.answer} and you chose {this.state.userInput}!
                </p>
              </div>
            ) : (
              <h2 className="translate-header">Translate the word:</h2>
            )}

            <span className="translate-word">{this.state.currentWord}</span>

            <div className="form-alignment">
              <div className="aligning">
                {!this.state.btnClicked ? (
                  <label htmlFor="learn-guess-input" className="learn-guess">
                    What's the translation for this word?
                  </label>
                ) : (
                  <p></p>
                )}
                {!this.state.btnClicked ? (
                  <Input
                    id="learn-guess-input"
                    type="text"
                    value={this.state.userInput}
                    onChange={this.inputChanged}
                    required
                  />
                ) : (
                  <p></p>
                )}
                {/* when btn is clicked ? answer : display translation  */}
                {this.state.btnClicked ? (
                  this.state.isCorrect ? (
                    <h2>You were correct! :D</h2>
                  ) : (
                    <h2>Good try, but not quite right :(</h2>
                  )
                ) : (
                  <h2></h2>
                )}
                {/* render nextword button or render submit button */}
                {this.state.btnClicked ? (
                  <button className="submit-button" onClick={this.nextWord}>
                    Try another word!
                  </button>
                ) : (
                  <button type="submit" className="submit-button">
                    Submit your answer
                  </button>
                )}
                {/* if nextword button is rendered, render either they are right or wrong */}
                {(
                  <button className="submit-button" onClick={this.nextWord}>
                    Try another word!
                  </button>
                ) &&
                  this.state.btnClicked && (
                    <div>
                      {this.state.isCorrect ? (
                        <div className="Displayfeed">
                          <p>Your total score is: {this.state.totalScore}</p>
                        </div>
                      ) : (
                        <div>
                          <p>Your total score is: {this.state.totalScore}</p>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}
