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
import additionJson from '../../truffle/build/contracts/Addition.json';

const customNodeOptions = {
  rpcUrl: 'http://127.0.0.1:7545', // your own node url
  chainId: 5777, // chainId of your own node
};

const fm = new Fortmatic(process.env.FORTMATIC_KEY, customNodeOptions);

// abi for the addition smart contract
const addition_ABI = [
  {
    constant: false,
    inputs: [
      {
        internalType: 'int256',
        name: 'x',
        type: 'int256',
      },
      {
        internalType: 'int256',
        name: 'y',
        type: 'int256',
      },
    ],
    name: 'add',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getSum',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'sum',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

const getAdditionAddress = () => {
  let json = JSON.stringify(additionJson);
  return JSON.parse(json).networks[5777].address;
};

// address of the addition smart contract
const addition_address = getAdditionAddress();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      account: '',
      email: '',
      balance: '',

      inputOne: '',
      inputTwo: '',
      result: null,
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

  addNumbersOnBlockchain = async () => {
    const addition_contract = new window.web3.eth.Contract(
      addition_ABI,
      addition_address,
    );

    await addition_contract.methods
      .add(this.state.inputOne, this.state.inputTwo)
      .send({ from: this.state.account }); // use send() whenever you're writing too blockchain})
    this.setState({ result: null });
  };

  getSumFromBlockchain = async () => {
    const addition_contract = new window.web3.eth.Contract(
      addition_ABI,
      addition_address,
    );

    let result = await addition_contract.methods.sum().call(); // use call() whenever you're reading from blockchain

    this.setState({ result });
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

  handleChange = propertyName => event => {
    this.setState({
      [propertyName]: event.target.value,
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
              {!isLoggedIn ? null : (
                <div>
                  <br />
                  Add two numbers and store them in the blockchain:
                  <br />
                  <input
                    value={this.state.inputOne}
                    onChange={this.handleChange('inputOne')}
                  ></input>
                  <input
                    value={this.state.inputTwo}
                    onChange={this.handleChange('inputTwo')}
                  ></input>
                  <button onClick={() => this.addNumbersOnBlockchain()}>
                    Add numbers
                  </button>
                  <br />
                  <br />
                  Read the sum stored on the blockchain:{' '}
                  <button onClick={() => this.getSumFromBlockchain()}>
                    Get Sum
                  </button>
                  {this.state.result}
                  <br />
                </div>
              )}
            </div>
            {/* <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/campaigns">
                <Campaigns />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch> */}
          </div>
        </Router>
      </>
    );
  }
}

export default hot(App);
