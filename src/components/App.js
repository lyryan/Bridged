/* eslint-disable */

import { hot } from 'react-hot-loader/root';
import React from 'react';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Header from './header';

import About from '../pages/About';
import Campaigns from '../pages/Campaigns';
import Home from '../pages/Home';

const customNodeOptions = {
  rpcUrl: 'http://127.0.0.1:7545', // your own node url
  chainId: 5777 // chainId of your own node
}

const fm = new Fortmatic(process.env.FORTMATIC_KEY, customNodeOptions)

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      account: '',
      email: '',
      balance: ''
    };
  }

  componentDidMount = async () => {
    
    console.log(fm.getProvider())
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
    const address = '0x65Ed94f41C3368c4Cf6a3F690c123d50bEeDA908'

    const addition_contract = new window.web3.eth.Contract(ABI, address)
    
    addition_contract.methods.add(1, 9).send({from: this.state.account}, async (data) => { // use send() whenever you're writing too blockchain
        let result = await addition_contract.methods.sum().call() // use call() whenever you're reading from blockchain
        console.log('this is the result', result)
      }) 

    

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
      this.setState({ isLoggedIn: false, account: '', email: '', balance: '' });
    });
  };

  getUserData = async () => {

  const userData = await fm.user.getUser();
  window.web3.eth.getAccounts((err, accounts) => {
    window.web3.eth.getBalance(accounts[0], (err, wei) => {
      let balance = wei/1000000000000000000 // convert wei to ether
      this.setState({
        account: accounts[0],
        email: userData.email,
        balance
      }).catch(() => {
        console.log('Error retrieving user data', err);
      });
    })
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
              <button onClick ={() => this.executeSmartContract()}>Do Math</button>

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
