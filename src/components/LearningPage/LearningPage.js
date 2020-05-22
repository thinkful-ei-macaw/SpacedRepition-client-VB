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
        console.log(data);
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
    console.log("this is the value of user input:", value);
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
        console.log(word);
        this.setState({
          currentWord: word.currentWord,
          nextWord: word.nextWord,
          totalScore: word.totalScore,
          wordCorrectCount: word.wordCorrectCount,
          wordIncorrectCount: word.wordIncorrectCount,
          isCorrect: word.isCorrect,
          answer: word.answer,
          btnClicked: true,
          userInput: "", ///to clear the field after submit
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

  //ref.current.value to get from input
  render() {
    let label = Label(
      { for: "learn-guess-input" },
      "answer",
      "Provide answer here"
    );
    let requiredLabel = Required({});
    // let score = <p className="DisplayScore">{`Your total score is: ${this.state.totalScore}`}</p>
    let score = this.score();
    return (
      <div>
        <form onSubmit={this.submitGuess}>
          <fieldset>
            <legend className="legend-title">Learn the word</legend>
            <p>Your total score is: {this.state.totalScore}</p>
            <p>
              You have answered this word correctly{" "}
              {this.state.wordCorrectCount} times.
            </p>
            <p>
              You have answered this word incorrectly{" "}
              {this.state.wordIncorrectCount} times.
            </p>
            <h2 className="translate-header">Translate the word:</h2>
            <span className="translate-word">{this.state.currentWord}</span>
            {/* <p>{label}</p> */}
            <div className="form-alignment">
              <div className="aligning">
                <label htmlFor="learn-guess-input" className="learn-guess">
                  What's the translation for this word?
                </label>
                <Input
                  id="learn-guess-input"
                  type="text"
                  value={this.state.userInput}
                  onChange={this.inputChanged}
                  required
                />

                {/* render nextword button or render submit button */}
                {this.state.btnClicked ? (
                  <button className="submit-button" onClick={this.nextWord}>Next Word</button>
                ) : (
                  <button type="submit" className="submit-button">Submit your answer</button>
                )}
                {/* if nextword button is rendered, render either they are right or wrong */}
                {<button className="submit-button" onClick={this.nextWord}>Next Word</button> &&
                  this.state.btnClicked && (
                    <div>
                      {this.state.isCorrect ? (
                        <div>
                          <p>
                            Congratulations {this.state.answer} was correct!
                          </p>{" "}
                          <p className="DisplayScore p">
                            Your total score is: {this.state.totalScore}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p>
                            Sorry, incorrect. The answer was:{" "}
                            {this.state.answer}. was correct!
                          </p>{" "}
                          <p className="DisplayScore">
                            Your total score is: {this.state.totalScore}
                          </p>
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

{
  /* text populating when btn is clicked for cypress! */
}
// {<button onClick={this.nextWord}>Next Word</button> &&
// this.state.btnClicked && (
//   <div>
//     {this.state.isCorrect ? (
//       <div>
//         {<p>Your total score is: {this.state.totalScore}</p>}
//       </div>
//     ) : (
//       <p>Your total score is: {this.state.totalScore}</p>
//     )}
//   </div>
// )}
