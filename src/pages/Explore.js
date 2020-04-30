import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { crowdfunding, campaign } from '../config';
import Card from '../components/card';
import Loader from '../components/loader';
import Suggestions from '../components/search-results';
import styles from './Explore.module.css';

const useStyles = theme => ({
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: '30px',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#f7f7f7',
    '&:hover': {
      backgroundColor: '#f7f7f7',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '400px',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '400px',
  },
  inputInput: {
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
});

const getFilteredList = (arr, input) => {
  if (input === '') return [];
  const len = input.length;
  // filter by address, campaign title or name of campaign creator
  return arr.filter(element => {
    if (
      //element.address.substring(0, len).toLowerCase() === input.toLowerCase() ||
      element.campaignTitle.substring(0, len).toLowerCase() ===
      input.toLowerCase()
    )
      return element;
    return null;
  });
};

class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: [],
      searchInput: '',
      searchResults: [],
      loading: true,
    };
  }

  componentDidUpdate(prevProps) {
    const { web3 } = this.props;
    if (web3 !== prevProps.web3) {
      this.getCampaigns();
    }
  }

  componentDidMount = () => {
    const { web3 } = this.props;
    if (web3) {
      this.getCampaigns();
    }
  };

  getCampaigns = async () => {
    this.setState({ loading: true });
    const { web3 } = this.props;
    const crowdfundInstance = new web3.eth.Contract(
      crowdfunding.ABI,
      crowdfunding.ADDRESS,
    );

    await crowdfundInstance.methods
      .returnAllCampaigns()
      .call()
      .then(async allCampaigns => {
        console.log('these are all the campaigns being returned', allCampaigns);
        const promises = allCampaigns.map(async campaignAddress => {
          const campaignInst = new web3.eth.Contract(
            campaign.ABI,
            campaignAddress,
          );

          const campaignInfo = await campaignInst.methods.getDetails().call();
          campaignInfo.address = campaignAddress;
          campaignInfo.contract = campaignInst;
          return campaignInfo;
        });
        const campaigns = await Promise.all(promises);
        this.setState({ campaigns });
      });
    this.setState({ loading: false });
  };

  showAllCampaigns = () => {
    const { web3 } = this.props;
    const { campaigns } = this.state;
    return campaigns.map(el => {
      const expiryDate = new Date(el.deadline * 1000).toUTCString();
      const goalAmount = web3.utils.fromWei(el.goalAmount, 'ether'); // convert wei to ether
      const totalFunded = web3.utils.fromWei(el.totalFunded, 'ether'); // convert wei to ether
      return (
        <div className={styles.card}>
          <Card
            key={el.address}
            campaignHash={el._photoHash}
            campaignTitle={el.campaignTitle}
            campaignDesc={el.campaignDesc}
            campaignCreator={el.campaignStarter}
            expiryDate={expiryDate}
            totalFunded={totalFunded}
            fundingGoal={goalAmount}
            backers={el.backers}
            route={`/campaigns/${el.address}`}
          />
        </div>
      );
    });
  };

  handleChange = e => {
    const { campaigns } = this.state;
    const input = e.target.value;
    const searchResults = getFilteredList(campaigns, input);
    this.setState({ searchInput: input, searchResults });
  };

  // renderSearchResults = () => {
  //   const { searchResults } = this.state;
  //   return searchResults.map(element => {
  //     return (
  //       <div key={element.address}>
  //         <Link to={`/campaigns/${element.address}`}>
  //           Title: {element.campaignTitle}
  //           <br />
  //           Creator:
  //           <br /> {element.address}
  //         </Link>
  //       </div>
  //     );
  //   });
  // };

  render() {
    const { searchInput, searchResults, loading } = this.state;
    const { classes } = this.props;

    return (
      <div>
        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <div className={classes.searchContainer}>
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
                  onChange={this.handleChange}
                />
                {searchInput.length ? (
                  <Suggestions searchResults={searchResults} />
                ) : null}
              </div>
            </div>
            <h3 className={styles.header}>Campaigns</h3>
            <div className={styles.cardContainer}>
              {this.showAllCampaigns()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(Explore);
