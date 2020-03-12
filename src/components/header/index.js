import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import Logo from '../../svg/logo-black.svg';
import CreateCampaigns from '../../pages/CreateCampaigns';
import Explore from '../../pages/Explore';
import Campaign from '../../pages/Campaign';
import Home from '../../pages/Home';

const useStyles = makeStyles(theme => ({
  colorPrimary: {
    backgroundColor: '#F6F6F6',
    color: '#F6F6F6',
  },
  navItem: {
    fontWeight: 800,
    color: '#2A2D33',
    marginRight: '20px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
  },
  logIn: {
    color: '#4BA173',
    borderColor: '#4BA173',
    '&:hover': {
      background: 'rgba(75, 161, 115, 0.1)',
    },
  },
  grow: {
    flexGrow: 1,
    flexBasis: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.55),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.35),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '40%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    color: '#2A2D33',
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const PrimarySearchAppBar = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { handleLogIn, isLoggedIn, logout, account, web3, ipfs } = props;
  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Router>
      <div>
        <AppBar className={classes.colorPrimary} position="static">
          <Toolbar>
            <div className={classes.grow}>
              <div className={classes.nav}>
                <Link style={{ textDecoration: 'none' }} to="/explore">
                  <Typography className={classes.navItem} variant="subtitle1">
                    Explore
                  </Typography>
                </Link>
                <Link style={{ textDecoration: 'none' }} to="/create-campaign">
                  <Typography className={classes.navItem} variant="subtitle1">
                    Start a Campaign
                  </Typography>
                </Link>
              </div>
            </div>

            <div className={classes.grow}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Link to="/">
                  <Logo />
                </Link>
              </div>
            </div>

            <div className={classes.sectionDesktop}>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
              <Button
                style={{ display: isLoggedIn ? 'none' : 'block' }}
                onClick={handleLogIn}
                className={classes.logIn}
                variant="outlined"
              >
                {isLoggedIn ? 'Sign Out' : 'Sign In'}
              </Button>
              <Button
                style={{ display: isLoggedIn ? 'block' : 'none' }}
                onClick={logout}
                className={classes.logIn}
                variant="outlined"
              >
                Sign Out
              </Button>
              {/* <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton> */}
            </div>

            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
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
            component={withRouter(({ ...childProps }) => (
              <Campaign
                match={childProps.match}
                web3={web3}
                account={account}
              />
            ))}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default PrimarySearchAppBar;
