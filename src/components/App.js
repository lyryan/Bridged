/* eslint-disable */

import { hot } from 'react-hot-loader/root';
import React from 'react';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';
import { default as contract } from 'truffle-contract';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Header from './header';

import About from '../pages/About';
import Campaigns from '../pages/Campaigns';
import Home from '../pages/Home';

const fm = new Fortmatic(process.env.FORTMATIC_KEY)

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      account: '',
      email: '',
    };
  }

  componentDidMount = async () => {
    window.web3 = new Web3(fm.getProvider());
    const isUserLoggedIn = await fm.user.isLoggedIn();
    if (isUserLoggedIn) {
      this.getUserData();
    }
    this.setState({
      isLoggedIn: isUserLoggedIn,
    });

  };

  executeSmartContract = async () => {
    const ABI = [
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "int256",
            "name": "x",
            "type": "int256"
          },
          {
            "internalType": "int256",
            "name": "y",
            "type": "int256"
          }
        ],
        "name": "add",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getSum",
        "outputs": [
          {
            "internalType": "int256",
            "name": "",
            "type": "int256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "sum",
        "outputs": [
          {
            "internalType": "int256",
            "name": "",
            "type": "int256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ]
    const address = '0x8C157284c2CE65aC966d3A0b183C36676Cd22e59'

    // Create contract object
    const tokenContract = await web3.eth.contract(ABI);
    // Instantiate contract
    const tokenContractInstance = await tokenContract.at(address);
    
    console.log('this is the account', this.state.account)
    await tokenContractInstance.add(1, 2, { from: this.state.account })
    
        // Call contract function (non-state altering) to get total token supply
    tokenContractInstance.getSum.call(function(error, result) {
      if (error) throw error;
      console.log(result);
    });
  }

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
      this.setState({ isLoggedIn: false, account: '', email: '' });
    });
  };

  getUserData = async () => {
    const userData = await fm.user.getUser();

    window.web3.eth.getAccounts((err, accounts) => {
      this.setState({
        account: accounts[0],
        email: userData.email,
      }).catch(() => {
        console.log('Error retrieving user data', err);
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
          logout={() => {
            this.logout();
          }}
        />
        <Router>
          <div>
            <div>
              <button
                type="submit"
                onClick={() => {
                  this.login();
                }}
              >
                Log In
              </button>
              <Link to="/">
                <button
                  type="submit"
                  onClick={() => {
                    this.logout();
                  }}
                >
                  Log Out
                </button>
              </Link>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {`isLoggedIn: ${isLoggedIn}`}
                <div>Public Address: {account}</div>
                <div>Email: {email}</div>
                <button onClick ={() => this.executeSmartContract()}>Do Math</button>
              </div>
            </div>
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/campaigns">
                <Campaigns />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </>
    );
  }
}

export default hot(App);
