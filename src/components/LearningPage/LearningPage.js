import React from "react";
import { Label, Input, Required } from "../Form/Form";
import Config from "../../config";
import TokenService from "../../services/token-service";

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

  //ref.current.value to get from input
  render() {
    let label = Label(
      { for: "learn-guess-input" },
      "answer",
      "Provide answer here"
    );
    let requiredLabel = Required({});

    return (
      <div>
        <form onSubmit={this.submitGuess}>
          <fieldset>
            <p>Total score: {this.state.totalScore}</p>
            <p>Word correct count: {this.state.wordCorrectCount}</p>
            <p>Word incorrect count: {this.state.wordIncorrectCount}</p>
            <h2>Translate the word:</h2>
            <span>{this.state.currentWord}</span>
            {/* <p>{label}</p> */}
            <p>
              <label htmlFor="learn-guess-input">
                What's the translation for this word?
              </label>
              <Input
                id="learn-guess-input"
                type="text"
                value={this.state.userInput}
                onChange={this.inputChanged}
                required
              />
              {requiredLabel}
            </p>
            {/* render nextword button or render submit button */}
            {this.state.btnClicked ? (
              <button onClick={this.nextWord}>Next Word</button>
            ) : (
              <button type="submit">Submit Guess</button>
            )}
            {/* if nextword button is rendered, render either they are right or wrong */}
            {<button onClick={this.nextWord}>Next Word</button> &&
              this.state.btnClicked && (
                <div>
                  {this.state.isCorrect ? (
                    <div>
                      {`Congratulations ${this.state.answer} was correct!`}
                    </div>
                  ) : (
                    `Sorry, incorrect. The answer was: ${this.state.answer}`
                  )}
                </div>
              )}
          </fieldset>
        </form>
      </div>
    );
  }
}
