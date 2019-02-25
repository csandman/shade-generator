import React, { Component } from "react";
import "./HamburgerButton.scss";

class HamburgerButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open ? this.props.open : false,
      color: this.props.color ? this.props.color : "#7a7a7a"
    };
  }

  render() {
    return (
      <div
        className={
          "hamburger-button " +
          this.props.className +
          (this.props.open ? " close" : "")
        }
        onClick={this.props.action}
      >
        <span className="line" style={{ backgroundColor: this.props.color }} />
        <span className="line" style={{ backgroundColor: this.props.color }} />
        <span className="line" style={{ backgroundColor: this.props.color }} />
      </div>
    );
  }
}

export default HamburgerButton;
