import React from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import { crowdfunding, campaign } from '../config';
import Card from '../components/card';
import styles from './Explore.module.css';

const getFilteredList = (arr, input) => {
  if (input === '') return [];
  const len = input.length;
  // filter by address, campaign title or name of campaign creator
  return arr.filter(element => {
    if (
      element.address.substring(0, len) === input ||
      element.campaignTitle.substring(0, len) === input
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
      );
    });
  };

  handleChange = e => {
    const { campaigns } = this.state;
    const input = e.target.value;
    const searchResults = getFilteredList(campaigns, input);
    this.setState({ searchInput: input, searchResults });
  };

  renderSearchResults = () => {
    const { searchResults } = this.state;
    return searchResults.map(element => {
      return (
        <div id={styles.searchResults} key={element.address}>
          <div id={styles.center}>
            <div style={{ width: '10%' }}>
              <Link to={`/campaigns/${element.address}`}>
                <img
                  style={{ height: '10%', width: '100%' }}
                  alt="campaign"
                  src={`https://ipfs.io/ipfs/${element._photoHash}`}
                />
              </Link>
            </div>
            <div>
              <Link to={`/campaigns/${element.address}`}>
                Title: {element.campaignTitle}
                <br />
                Creator: {element.address}
              </Link>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    const { searchInput, searchResults, loading } = this.state;
    return (
      <div>
        {loading ? (
          <CircularProgress />
        ) : (
          <div>
            <div id={styles.search}>
              <SearchIcon />
              <form>
                <input
                  type="text"
                  placeholder="Search Campaigns..."
                  onChange={this.handleChange}
                  value={searchInput}
                />
              </form>
            </div>
            <div>
              {searchResults.length > 0 ? this.renderSearchResults() : null}
            </div>
            <div className={styles.cardContainer}>
              {this.showAllCampaigns()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Explore;
