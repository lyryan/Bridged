import React from 'react';

import { Link } from 'react-router-dom';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const useStyles = () => ({
  root: {
    width: '100%',
    position: 'absolute',
  },
  menuItem: {
    padding: 0,
  },
});

class TypographyMenu extends React.Component {
  render() {
    const { searchResults, classes } = this.props;

    return (
      <Paper className={classes.root}>
        <MenuList className={classes.menuItem}>
          {searchResults.length ? (
            searchResults.map((element, index, arr) => {
              return (
                <Link
                  to={`/campaigns/${element.address}`}
                  style={{ textDecoration: 'none' }}
                  key={element.address}
                >
                  <MenuItem>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 60,
                          height: 50,
                          marginRight: '7px',
                        }}
                      >
                        <img
                          style={{
                            objectFit: 'contain',
                            height: '100%',
                            width: '100%',
                          }}
                          alt="campaign"
                          src={`https://ipfs.io/ipfs/${element._photoHash}`}
                        />
                      </div>
                      <div style={{ color: '#2f333a' }}>
                        {element.campaignTitle}
                      </div>
                    </div>
                  </MenuItem>
                  {index !== arr.length - 1 ? <Divider /> : null}
                </Link>
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
