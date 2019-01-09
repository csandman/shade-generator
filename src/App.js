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
      console.log(opac)
      outArr.push(parse(this.rgbToHex(...this.calculateColor(rgb,false,opac/100))));
    }
    console.log('end of first loop')
    for (let opac = 5; opac <= 90; opac+=5) {
      console.log(opac)
      outArr.push(parse(this.rgbToHex(...this.calculateColor(rgb,true,opac/100))));
    }
    console.log(outArr);
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
      console.log('Color from color-parse',color);
      let resultRgb = this.calculateColor(color, true, 0.15);
      console.log('dimmed color',resultRgb);
      let result = this.rgbToHex(...resultRgb);
      console.log(this.rgbToHex(...color));
      document.querySelector('.container').style.backgroundColor = this.state.inputValue;
      document.querySelector('body').style.backgroundColor = result;
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
  
  parseRGB(colorStr) {
    return colorStr.split(',').map(
      val => Number(val.replace(/\D/g,''))
    );
  }
      
      
  componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
  
  rgbToHex(r, g, b) {
      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  }
  
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  copyHexCode(e) {
    console.log(e.target.dataset.index)
    const output = this.state.colorArr[e.target.dataset.index].hex;
    this.copyToClipboard(output);
  }

  copyRgb(e) {
    console.log(e.target.dataset.index)
    const rgb = this.state.colorArr[e.target.dataset.index].rgb;
    const output = 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
    this.copyToClipboard(output);
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
