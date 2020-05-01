import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import userIcon from '../images/user-icon.png';

const useStyles = {
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  icon: {
    width: '120px',
  },
  header: {
    fontFamily: 'acumin-pro, sans-serif',
    fontWeight: '700',
    fontSize: '14px',
    textTransform: 'uppercase',
    color: '#353a42b5',
    letterSpacing: '2px',
  },
  content: {
    fontFamily: 'acumin-pro, sans-serif',
    wordWrap: 'break-word',
    color: '#2f333a',
    fontSize: '16px',
    marginBottom: '5%',
  },
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
            height: '650px',
          }}
        >
          <div className={classes.iconContainer}>
            <img className={classes.icon} src={userIcon} alt="User Icon" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
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
