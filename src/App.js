import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const MODES = { SETUP: "SETUP", TEST: "TEST" }
const OPERATOR_NAMES = { PLUS: "PLUS", MINUS: "MINUS", MULTIPLY: "MULTIPLY", DIVIDE: "DIVIDE" }
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOperators: [],
      selectedNumbers: [],
      mode: MODES.SETUP,
      problem: null,
      lastAnswerCorrect: null,
      questionsRemaining: 20,
      amountCorrect: 0,
      amountWrong: 0
    }
  }
  operators = [
    {
      name: OPERATOR_NAMES.PLUS,
      symbol: "+"
    },
    {
      name: OPERATOR_NAMES.MINUS,
      symbol: "−"
    },
    {
      name: OPERATOR_NAMES.MULTIPLY,
      symbol: "×"
    },
    {
      name: OPERATOR_NAMES.DIVIDE,
      symbol: "÷"
    }
  ]
  numbers = [
    1,2,3,4,5,6,7,8,9,10,11,12
  ]
  
  addToOperators = (op) => {
    if(this.state.selectedOperators.includes(op)) {
      this.setState({
        selectedOperators: this.state.selectedOperators.filter(x => x.name !== op.name),
      });
    } else {
      this.setState({
        selectedOperators: this.state.selectedOperators.concat([op]),
      });
    }
  }
  addToNumbers = (num) => {
    if(this.state.selectedNumbers.indexOf(num) > -1) {
      this.setState({
        selectedNumbers: this.state.selectedNumbers.filter(x => x !== num)
      });
    } else {
      this.setState({
        selectedNumbers: this.state.selectedNumbers.concat([num])
      });
    }
  }  
  handleToggleTest = (start) => {
    this.setState({
      mode: start ? MODES.TEST : MODES.SETUP
    })
  }
  getRandomArbitrary = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  getCorrectAnswer = (problem) => {
    switch(problem.operator.name) {
      case OPERATOR_NAMES.PLUS:
        return { value: parseFloat(problem.topNumber) + parseFloat(problem.bottomNumber), correct: true }
      case OPERATOR_NAMES.MINUS:
        return { value: parseFloat(problem.topNumber) - parseFloat(problem.bottomNumber), correct: true }
      case OPERATOR_NAMES.MULTIPLY:
        return { value: parseFloat(problem.topNumber) * parseFloat(problem.bottomNumber), correct: true }
      case OPERATOR_NAMES.DIVIDE:
        return { value: parseFloat(problem.topNumber) / parseFloat(problem.bottomNumber), correct: true }
      default:
        return null
    }
  }
  shuffleAnswers(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  getWrongAnswer = (problem, correctAnswer) => {
    let max = 161;
    if(problem.operator.name == OPERATOR_NAMES.PLUS) {
      max = 30;
    }
    if(problem.operator.name == OPERATOR_NAMES.MINUS) {
      max = 21;
    }
    let ans = this.getRandomArbitrary(0, max);
    if(ans === correctAnswer.value) {
      ans++;
    }
    return { value: ans, correct: false }
  }
  submitAnswer = (answer) => {
    if(this.state.questionsRemaining > 0) {
      this.setState({
        questionsRemaining: --this.state.questionsRemaining,
        problem: this.buildProblem(),
        lastAnswerCorrect: answer.correct
      })
    }
    
  }
  startTest = () => {
    this.setState({
      problem: this.buildProblem(),
      mode: MODES.TEST
    })
  }

  endTest = () => {
    this.setState({
      problem: null,
      mode: MODES.SETUP
    })
  }

  buildProblem = () => {
    let problem = {};
    let answers = [];
    //Get operator first
    problem.operator = this.state.selectedOperators[this.getRandomArbitrary(0, this.state.selectedOperators.length)];
    //Get starting top and bottom numbers
    problem.topNumber = this.state.selectedNumbers[this.getRandomArbitrary(0, this.state.selectedNumbers.length)];
    problem.bottomNumber = this.state.selectedNumbers[this.getRandomArbitrary(0, this.state.selectedNumbers.length)];
    let correctAnswer = this.getCorrectAnswer(problem)
    //IF doing subtraction or division make sure the first number is bigger
    if(problem.operator.name === OPERATOR_NAMES.MINUS || problem.operator.name === OPERATOR_NAMES.DIVIDE) {
      while(problem.topNumber < problem.bottomNumber || correctAnswer.value.toString().indexOf('.') > -1) {
        problem.topNumber = this.state.selectedNumbers[this.getRandomArbitrary(0, this.state.selectedNumbers.length)];
        problem.bottomNumber = this.state.selectedNumbers[this.getRandomArbitrary(0, this.state.selectedNumbers.length)];
        correctAnswer = this.getCorrectAnswer(problem)
      }
    }
    
    answers.push(correctAnswer);
    answers.push(this.getWrongAnswer(problem, correctAnswer));
    answers.push(this.getWrongAnswer(problem, correctAnswer));
    answers.push(this.getWrongAnswer(problem, correctAnswer));
    problem.answers = this.shuffleAnswers(answers);
    return problem;
  }
  render() {
    let problem = null;
    if(this.state.mode === MODES.TEST) {
      problem = this.buildProblem();
    }
    let operationsBlock = this.operators.map(op => 
      <div key={op.name} className={'option ' + (this.state.selectedOperators.includes(op) ? 'selected' : '')} onClick={this.addToOperators.bind(this, op)}>{op.symbol}</div>
    )
    let numbersBlock = this.numbers.map((num, index) => 
      <div key={num} className={'option ' + (this.state.selectedNumbers.indexOf(num) > -1 ? 'selected' : '')} onClick={this.addToNumbers.bind(this, num)}>{num}</div>
    )
    let answerBlock = problem && problem.answers.map((ans, index) => <div className="option answer" key={index} onClick={this.submitAnswer.bind(this, ans)}>{ans.value}</div>);
    return (
      <div className="App">
        {
          this.state.mode === MODES.SETUP && 
          <div className="wrapper">
            <div className="options-container">
              {operationsBlock}
              {numbersBlock}
            </div>
            <div className="start-button" onClick={this.startTest.bind(this)}>Start</div>
          </div>
        }
        {
          this.state.mode === MODES.TEST && 
          <div className="wrapper">
          <div className="counter-container">
            <div className="remaining">{this.state.questionsRemaining}</div>
            <div className="correct">{this.state.amountCorrect}</div>
            <div className="wrong">{this.state.amountWrong}</div>
          </div>
          {this.state.lastAnswerCorrect && <div className="answer-result correct">Correct!</div>}
          {this.state.lastAnswerCorrect != null && !this.state.lastAnswerCorrect && <div className="answer-result wrong">Sorry, that is not correct :(</div>}
            
            <div className="problem-container">
              <div className="top-number">{problem.topNumber}</div>
              <div className="operator">{problem.operator.symbol}</div>
              <div className="bottom-number">{problem.bottomNumber}</div>
            </div>
            <div className="answer-container">
              {answerBlock}
            </div>
            <div className="start-button" onClick={this.endTest.bind(this, false)}>Change Settings</div>
          </div>
        }
        
      </div>
    );
  }
}

class BuilderOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    }
    this.type = props.type;
    this.value = props.value;
  }
  handleClick = () => {
    this.setState({selected: !this.state.selected});
    //if()
    this.props.onToggle(this.value);
  }
  handleDeselected = () => {
    this.props.onDeselect(this.value);
  }
  render() {
    return (<div className={"option " + this.type + ' ' + (this.state.selected ? 'selected' : '')} onClick={this.handleClick.bind(this)}>{this.value}</div>)
  }
}
export default App;
