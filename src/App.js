import React, { Component } from "react";
import { Popup } from 'semantic-ui-react'
import "./App.css";

var parse = require('parse-color');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      color: [36,103,182],
      colorArr: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnterPress = this.handleEnterPress.bind(this);
    this.copyHexCode = this.copyHexCode.bind(this);
    this.copyRgb = this.copyRgb.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleEnterPress, false);
    this.calcAllGradients(this.state.color);
  }

  handleEnterPress(e){
    if(e.keyCode === 13){
      this.handleSubmit();
    }
  }

  calcAllGradients(rgb) {
    let outArr = [];
    for (let opac = 90; opac >= 5; opac-=5) {
      outArr.push(parse(this.rgbToHex(...this.calculateColor(rgb,false,opac/100))));
    }
    for (let opac = 5; opac <= 90; opac+=5) {
      outArr.push(parse(this.rgbToHex(...this.calculateColor(rgb,true,opac/100))));
    }
    this.setState({colorArr: outArr});
  }

  handleChange(event) {
    this.setState({inputValue: event.target.value});
  }

  handleSubmit() {
    let color = parse(this.state.inputValue).rgb
    if (!color)
      color = parse('#' + this.state.inputValue).rgb
    if(color) {
      const bgrgb = this.calculateColor(color, true, 0.15);
      const background = this.rgbToHex(...bgrgb);
      document.querySelector('.container').style.backgroundColor = this.state.inputValue;
      document.querySelector('body').style.backgroundColor = background;
      this.setState({color: color});
      this.calcAllGradients(color);
    }
  }

  calculateColor(colorVals, isDark, opacity) {
    if (isDark) {
      return colorVals.map(val => this.calculateIndividualColor(val,0,opacity))
    } else {
      return colorVals.map(val => this.calculateIndividualColor(val,255,opacity))
    } 
  }
  
  calculateIndividualColor(color, bColor, opacity) {
    return Math.round(opacity * bColor + (1 - opacity) * color);
  }    

  rgbToHex(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
      
  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
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
      <div className="App">
        <div className="outer-container">
          <div className="input-container">
            <div className="ui action input">
              <input 
                type="text"
                placeholder="Color Code (Hex, RGB, or Name)"
                onChange={this.handleChange}
                value={this.state.inputValue}/>
              <button 
                onClick={this.handleSubmit}
                className="ui button">
                GO
              </button>
            </div>
          </div>
          <div className="container">
            {
              this.state.colorArr.map(
              (color,i) => {
                  return (
                    <Popup 
                      key={color.hex} 
                      trigger={<div style={{backgroundColor:color.hex}}
                      className="color-square"></div>} 
                      hoverable 
                      position='bottom center'>
                      <div className="popup-button space-below">
                        <button 
                          data-index={i}
                          onClick={this.copyHexCode}
                          className="ui button">
                          {'Hex: ' + color.hex.toUpperCase()}
                        </button>
                      </div>
                      <div className="popup-button">
                        <button 
                          data-index={i}
                          onClick={this.copyRgb}
                          className="ui button">
                          {'RGB: (' + color.rgb[0] + ', ' + color.rgb[1] + ', ' + color.rgb[2] + ')'}
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
