import React, { Component } from "react";
import "./Header.scss";

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.handleSignInClick = this.handleSignInClick.bind(this);
  }

  handleSignInClick(e) {}

  handleSignUpClick(e) {}

  render() {
    return (
      <div
        id="header"
        style={{ borderBottom: "2px solid " + this.props.contrastColor }}
      >
      <div style={{ color: this.props.contrastColor }} className="title-text">
        { this.props.colorArr.length &&
          <div className="icon">
            <div style={{backgroundColor: this.props.colorArr[10].hex}} className="icon-dot"></div> 
            <div style={{backgroundColor: this.props.colorArr[24].hex}} className="icon-dot"></div> 
            <div style={{backgroundColor: this.props.colorArr[24].hex}} className="icon-dot"></div> 
            <div style={{backgroundColor: this.props.colorArr[10].hex}} className="icon-dot"></div> 
          </div>
        }
        Shade Generator
      </div>
        <div className="right-content">
          <button
            onClick={this.props.handleSignupClick}
            style={{ color: this.props.contrastColor }}
          >
            Sign in
          </button>
          <i
            aria-hidden="true"
            className="bars big icon"
            style={{ color: this.props.contrastColor }}
            onClick={this.props.openSidebar}
          />
        </div>
      </div>
    );
  }
}

// <span className="title-letter" style={{color: "#c6c4c3"}}>S</span>
//             <span className="title-letter" style={{color: "#bab8b7"}}>H</span>
//             <span className="title-letter" style={{color: "#afacab"}}>A</span>
//             <span className="title-letter" style={{color: "#a3a09f"}}>D</span>
//             <span className="title-letter" style={{color: "#989493"}}>E</span>
//             <span className="title-letter">&nbsp;</span>
//             <span className="title-letter" style={{color: "#8d8888"}}>G</span>
//             <span className="title-letter" style={{color: "#817c7c"}}>E</span>
//             <span className="title-letter" style={{color: "#767070"}}>N</span>
//             <span className="title-letter" style={{color: "#6a6464"}}>E</span>
//             <span className="title-letter" style={{color: "#5f5858"}}>R</span>
//             <span className="title-letter" style={{color: "#534d4c"}}>A</span>
//             <span className="title-letter" style={{color: "#484140"}}>T</span>
//             <span className="title-letter" style={{color: "#3c3534"}}>O</span>
//             <span className="title-letter" style={{color: "#312928"}}>R</span>