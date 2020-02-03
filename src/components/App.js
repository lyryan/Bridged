/* eslint-disable */

import { hot } from 'react-hot-loader/root';
import React from 'react';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';

import Header from './header';

const customNodeOptions = {
  rpcUrl: 'http://127.0.0.1:7545', // your own node url
  chainId: 5777, // chainId of your own node
};

const fm = new Fortmatic(process.env.FORTMATIC_KEY, customNodeOptions);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      account: '',
      email: '',
      balance: '',
    };
  }

  componentDidMount = async () => {
    console.log(fm.getProvider());
    window.web3 = new Web3(fm.getProvider());

    const isUserLoggedIn = await fm.user.isLoggedIn();
    if (isUserLoggedIn) {
      this.getUserData();
    }
    this.setState({
      isLoggedIn: isUserLoggedIn,
    });
  };

  login = async () => {
    await fm.user
      .login()
      .then(account => {
        this.getUserData();
        this.setState({ account, isLoggedIn: true });
      })
      .catch(err => {
        console.log('Error logging in with Fortmatic', err);
      });
  };

  logout = async () => {
    await fm.user.logout().then(() => {
      this.setState({ isLoggedIn: false, account: '', email: '', balance: '' });
    });
  };

  getUserData = async () => {
    const userData = await fm.user.getUser();
    window.web3.eth.getAccounts((err, accounts) => {
      window.web3.eth.getBalance(accounts[0], (err, wei) => {
        let balance = wei / 1000000000000000000; // convert wei to ether
        this.setState({
          account: accounts[0],
          email: userData.email,
          balance,
        }).catch(() => {
          console.log('Error retrieving user data', err);
        });
      });
    });
  };

  render() {
    const { isLoggedIn, account, email } = this.state;
    return (
      <>
        <Header
          handleLogIn={() => {
            this.login();
          }}
          isLoggedIn={isLoggedIn}
          account={account}
          logout={() => {
            this.logout();
          }}
        />
        <div>
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {`isLoggedIn: ${isLoggedIn}`}
              <div>{this.state.account}</div>
              <div>Balance: {this.state.balance}</div>
              <div>Email: {email}</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default hot(App);
