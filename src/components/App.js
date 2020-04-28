import { hot } from 'react-hot-loader/root';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';
import Ipfs from 'ipfs-api';

import CreateCampaigns from '../pages/CreateCampaigns';
import Explore from '../pages/Explore';
import MyAccount from '../pages/MyAccount';
import Campaign from '../pages/Campaign';
import Home from '../pages/Home';

import Header from './header';

const customNodeOptions = {
  rpcUrl: 'http://127.0.0.1:7545', // your own node url
  chainId: 5777, // chainId of your own node
};

const fm = new Fortmatic(process.env.FORTMATIC_KEY, customNodeOptions);
const isUserLoggedIn = fm.user.isLoggedIn();
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      account: '',
      email: '',
      balance: '',
      ipfs: null,
      web3: null,
    };
  }

  componentDidMount = async () => {
    this.setState({ isLoggedIn: isUserLoggedIn });

    const web3 = await new Web3(fm.getProvider());
    const ipfs = new Ipfs({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    });

    this.setState({ web3, ipfs }, () => {
      if (isUserLoggedIn) {
        this.getUserData();
      }
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
    const { web3 } = this.state;
    const userData = await fm.user.getUser();
    web3.eth.getAccounts((error, accounts) => {
      web3.eth.getBalance(accounts[0], (err, wei) => {
        const balance = web3.utils.fromWei(wei, 'ether'); // convert wei to ether
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
    const { isLoggedIn, account, balance, email, web3, ipfs } = this.state;
    return (
      <Router>
        <Header
          handleLogIn={this.login}
          isLoggedIn={isLoggedIn}
          account={account}
          balance={balance}
          email={email}
          logout={() => {
            this.logout();
          }}
          web3={web3}
          ipfs={ipfs}
        />
        <Switch>
          <Route exact path="/">
            <Home web3={web3} />
          </Route>
          <Route path="/create-campaign">
            <CreateCampaigns account={account} web3={web3} ipfs={ipfs} />
          </Route>
          <Route path="/explore">
            <Explore web3={web3} />
          </Route>
          <Route
            path="/campaigns/:address"
            render={routeProps => (
              <Campaign web3={web3} {...routeProps} account={account} />
            )}
          />
          <Route path="/my-account">
            <MyAccount account={account} email={email} balance={balance} />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default hot(App);
