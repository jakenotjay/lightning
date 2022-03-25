import React from 'react';
import {Redirect} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SignIn from '../components/SignIn.jsx';

export default class SignInPage extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      open: false,
      errorText: '',
      success: false
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.checkDetails = this.checkDetails.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleClose() {
    this.setState({open : false});
  }

  checkDetails = async () => { 
    var url = '/api/checkUser'
    await fetch(url, {
      method: 'POST',
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response.success){
        this.setState({success: true});
      } else {
        this.setState({errorText : response.reason, open: true});
      }
    })
  }

  render(){
    return (
      <div>
        {this.state.success ? (
          <Redirect to="/reports" />
        ):
        (
          <div>
            <SignIn
              email={this.state.email}
              password={this.state.password}
              handleEmailChange={this.handleEmailChange}
              handlePasswordChange={this.handlePasswordChange}
              checkDetails = {this.checkDetails}
            />
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Invalid Password"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {this.state.errorText}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Okay
              </Button>
              </DialogActions>
            </Dialog>
          </div>
        )
        }
        
      </div>
    );
  }
}