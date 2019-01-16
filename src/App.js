import React, { Component } from "react";
import { Popup } from 'semantic-ui-react'
import "./App.css";

import { 
  calcTextColor,
  getColorName,
  rgbToHex,
  calcAllGradients
} from './Functions';

const parse = require('parse-color');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      color: [36,103,182],
      hexColor: "",
      colorArr: [],
      textColor: 'white',
      colorName: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.copyHexCode = this.copyHexCode.bind(this);
    this.copyRgb = this.copyRgb.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleEnterPress, false);
    this.setState({
      colorName: getColorName(rgbToHex(...this.state.color)),
      textColor: calcTextColor(this.state.color),
      colorArr: calcAllGradients(this.state.color),
      hexColor: rgbToHex(...this.state.color)
    });
    
  }

  handleEnterPress(e){
    if(e.keyCode === 13){
      this.handleSubmit();
    }
  }

  handleInputChange(event) {
    this.setState({inputValue: event.target.value});
  }

  handleSubmit() {
    let color = parse(this.state.inputValue).rgb
    if (!color)
      color = parse('#' + this.state.inputValue).rgb
    if(color) {
      this.setState({
        color: color,
        colorName: getColorName(rgbToHex(...color)),
        textColor: calcTextColor(color),
        colorArr: calcAllGradients(color),
        hexColor: rgbToHex(...color)
      });
    }
  }

  copyHexCode(e) {
    const output = this.state.colorArr[e.target.dataset.index].hex;
    this.copyToClipboard(output);
    this.changeButtonText(e.target, "Copied!");
  }

  copyRgb(e) {
    const rgb = this.state.colorArr[e.target.dataset.index].rgb;
    const output = 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
    this.copyToClipboard(output);
    this.changeButtonText(e.target, "Copied!");
  }

  changeButtonText(button, text) {
    const original = button.textContent;
    button.textContent = text;
    setTimeout(() => {
      button.textContent = original;
    }, 1200);
  }

  copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  render() {
    return (
      <div className="App" style={{backgroundColor: this.state.hexColor }}>
        <div className="outer-container" >
          <div className="input-container">
            <div className="ui action input">
              <input 
                type="text"
                placeholder="Color Code (Hex, RGB, or Name)"
                onChange={this.handleInputChange}
                value={this.state.inputValue}/>
              <button 
                onClick={this.handleSubmit}
                className="ui button">
                GO
              </button>
            </div>
            <div className="color-name" style={{color: this.state.textColor}}>{this.state.colorName}</div>
          </div>
          <div className="container">
            {
              this.state.colorArr.map(
              (color,i) => {
                  return (
                    <Popup 
                      key={color.hex + i} 
                      trigger={<div style={{backgroundColor:color.hex}}
                      className="color-square"></div>} 
                      hoverable 
                      position='bottom center'>
                      <div className="popup-button space-below">
                        <button 
                          data-index={i}
                          onClick={this.copyHexCode}
                          className="ui button">
                          {color.hex.toUpperCase()}
                        </button>
                      </div>
                      <div className="popup-button">
                        <button 
                          data-index={i}
                          onClick={this.copyRgb}
                          className="ui button">
                          {'rgb: (' + color.rgb[0] + ', ' + color.rgb[1] + ', ' + color.rgb[2] + ')'}
                        </button>
                      </div>
                    </Popup>
                  )
                }
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
