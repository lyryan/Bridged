import React from 'react';

class MyAccount extends React.Component {
  render() {
    const { account, balance, email } = this.props;

    return (
      <div>
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div>{account}</div>
            <div>Balance: {balance}</div>
            <div>Email: {email}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyAccount;
