import { hot } from 'react-hot-loader/root';
import React from 'react';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import About from '../pages/About';
import Campaigns from '../pages/Campaigns';
import Home from '../pages/Home';

const fm = new Fortmatic(process.env.FORTMATIC_KEY);

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
    // fm.user.logout();

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
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/campaigns">Campaigns</Link>
              </li>
            </ul>
          </nav>
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
    );
  }
}

export default hot(App);
