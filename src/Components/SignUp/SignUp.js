import React, { Component } from 'react';
import './SignUp.scss';
import { withFirebase } from '../Firebase';


class SignUp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: ""
    }

    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleUserNameChange(event) {
    this.setState({ userName: event.target.value });
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(e) {
    const { userName, email, password } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        authUser.updateProfile({
          displayName: userName
        }).then(function() {
          
        }).catch(function(error) {
          // An error happened.
        });
        this.setState({
          userName: '',
          email: '',
          password: ''
        });
      })
      .catch(error => {
        this.setState({ error });
      });
      this.props.closeSignUpModal();
    e.preventDefault();
  }

  stopPropagation(e) {
    e.stopPropagation();
  }
  render() {
    return (
      <div id="signup-page" className={ this.props.isOpen ? "" : "hidden"} onClick={this.props.closeSignUpModal}>
        <div className="signup-modal" onClick={this.stopPropagation}>
          <div className="color-panel">
            <div className="color-pane-1"></div>
            <div className="color-pane-2"></div>
            <div className="color-pane-3"></div>
            <div className="color-pane-4"></div>
            <div className="color-pane-5"></div>
          </div>
          <div className="sign-in-content">
            <div className="flex-row">
              <div className="login-tab">Log in</div>
              <div className="signup-tab">Sign up</div>
            </div>
            <input type="text" placeholder="User Name" onChange={this.handleUserNameChange}
            value={this.state.userName} />
            <input type="text" placeholder="Email" onChange={this.handleEmailChange}
            value={this.state.email} />
            <input type="password" placeholder="Password" onChange={this.handlePasswordChange}
            value={this.state.password} />
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
      
      </div>
    )
  }
}

export default withFirebase(SignUp);