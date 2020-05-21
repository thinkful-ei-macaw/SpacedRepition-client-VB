import React from "react";
import { Label, Input, Required, Textarea } from "../Form/Form";
import Config from "../../config";
import TokenService from "../../services/token-service";
import Button from "../Button/Button";
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
    let value = this.userInput.current.value;
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
        });
      })
      .catch((err) => console.log(err));
  };

  results() {
    if (this.state.isCorrect) {
      return `That's right! Good Job`;
    }
  }

  //ref.current.value to get from input
  render() {
    let label = Label(
      { className: "guess-input" },
      "answer",
      "Provide answer here"
    );
    let requiredLabel = Required({});

    return (
      <div>
        <p>Total score: {this.state.totalScore}</p>
        <p>Word correct count: {this.state.wordCorrectCount}</p>
        <p>Word incorrect count: {this.state.wordIncorrectCount}</p>
        <p>{this.state.currentWord}</p>
        <p>{label}</p>
        <p>
          <Input type="text" ref={this.userInput} />
          {requiredLabel}
        </p>
        <p>
          {this.state.btnClicked ? (
            <button type="submit">Next Word</button>
          ) : (
            <button type="submit" onClick={this.submitGuess}>
              Submit Guess
            </button>
          )}
          {<button type="submit">Next Word</button> && <div>this.state.answer</div>}
        </p>
      </div>
    );
  }
}
