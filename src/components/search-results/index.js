import React from 'react';

import { Link } from 'react-router-dom';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const useStyles = () => ({
  root: {
    width: 500,
    position: 'absolute',
  },
  menuItem: {
    height: '70px',
  },
});

class TypographyMenu extends React.Component {
  render() {
    const { searchResults, classes } = this.props;
    return (
      <Paper className={classes.root}>
        <MenuList>
          {searchResults.length ? (
            searchResults.map(element => {
              return (
                <div>
                  <MenuItem className={classes.menuItem}>
                    <Link
                      to={`/campaigns/${element.address}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <img
                          style={{
                            height: '40px',
                            padding: '5px',
                          }}
                          alt="campaign"
                          src={`https://ipfs.io/ipfs/${element._photoHash}`}
                        />
                        <div style={{ color: '#2f333a' }}>
                          {element.campaignTitle}
                        </div>
                      </div>
                    </Link>
                  </MenuItem>
                  <Divider />
                </div>
              );
            })
          ) : (
            <MenuItem>
              No results found&nbsp;
              <span role="img" aria-label="slight-frowning-face">
                🙁
              </span>
            </MenuItem>
          )}
        </MenuList>
      </Paper>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(TypographyMenu);
