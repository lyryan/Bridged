import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import userIcon from '../images/user-icon.png';

const useStyles = {
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '3%'
  },
  icon: {
    width: '35%',
  },
  header: {
    fontFamily: 'acumin-pro, sans-serif',
    fontWeight: '700',
    fontSize: '20px',
    textTransform: 'uppercase',
    color: '#353a42b5',
    letterSpacing: '3px'
  },
  content: {
    fontFamily: 'acumin-pro, sans-serif',
    wordWrap: 'break-word',
    color: '#2f333a',
    fontSize: '20px',
    marginBottom: '5%'
  }
};

class MyAccount extends React.Component {
  render() {
    const { classes, account, balance, email } = this.props;

    return (
      <div>
        <div 
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '85vh'
          }}>
          <div className={classes.iconContainer}>
            <img className={classes.icon} src={userIcon} alt="User Icon"/>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className={classes.header}> Email:</div>
            <div className={classes.content}> {email} </div>
            <div className={classes.header}> Address: </div> 
            <div className={classes.content}> {account} </div>
            <div className={classes.header}> Balance: </div> 
            <div className={classes.content}> {balance} </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(MyAccount);
