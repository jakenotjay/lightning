import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SignUp from '../components/SignUp.jsx';


export default class SignInPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      phoneNumber: '',
      open: false,
      alertTitle: '',
      alertText: ''
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.newUser = this.newUser.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handlePhoneChange(event) {
      this.setState({phoneNumber: event.target.value});
  }

  handleClose() {
    this.setState({open : false});
  }

  newUser = async () => { 
    var url = '/api/newUser';
    await fetch(url, {
      method: 'POST',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        phoneNumber: this.state.phoneNumber
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response.success){
        this.setState({
            alertTitle: 'Account Created Successfully',
            alertText: 'Please contact an administrator to get your account verified',
            open: true
        });
      } else {
        this.setState({
            alertTitle: 'Failed to create an account',
            alertText : response.reason, 
            open: true})
      }
    })
  }

  render(){
    return (
      <div>
        <SignUp
          email={this.state.email}
          password={this.state.password}
          phoneNumber={this.state.phoneNumber}
          handleEmailChange={this.handleEmailChange}
          handlePasswordChange={this.handlePasswordChange}
          handlePhoneChange={this.handlePhoneChange}
          newUser = {this.newUser}
        />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.state.alertTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.alertText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Okay
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}