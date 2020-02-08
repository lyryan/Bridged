/*eslint-disable*/
import React from 'react';
import { crowdfunding, campaign } from '../config';
import Card from '../components/card';
import styles from './Explore.module.css';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

const getFilteredList = (arr, input) => {
  if (input === '') return [];
  let len = input.length;
  return arr.filter(element => {
    if (
      element.address.substring(0, len) === input ||
      element.campaignTitle.substring(0, len) === input ||
      element.campaignStarter.substring(0, len) === input
    )
      return element;
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
      const options = { dateStyle: 'full' };
      const expiryDate = new Date(el.deadline * 1000).toLocaleString(options); // convert to local time
      const goalAmount = web3.utils.fromWei(el.goalAmount, 'ether'); // convert wei to ether
      return (
        <Card
          key={el.address}
          campaignTitle={el.campaignTitle}
          campaignDesc={el.campaignDesc}
          campaignCreator={el.campaignStarter}
          deadline={expiryDate}
          fundingGoal={goalAmount}
          route={`/campaigns/${el.address}`}
        />
      );
    });
  };

  handleChange = e => {
    const input = e.target.value;
    const searchResults = getFilteredList(this.state.campaigns, input);
    this.setState({ searchInput: input, searchResults });
  };

  renderSearchResults = () => {
    return this.state.searchResults.map(element => {
      return (
        <div key={element.address}>
          <Link to={`/campaigns/${element.address}`}>
            Title: {element.campaignTitle}
            <br />
            Creator:
            <br /> {element.address}
          </Link>
        </div>
      );
    });
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          <CircularProgress />
        ) : (
          <div>
            <form>
              <input
                type="text"
                placeholder="Search Campaigns..."
                onChange={this.handleChange}
                value={this.state.searchInput}
              />
            </form>
            <div>
              {this.state.searchResults.length > 0
                ? this.renderSearchResults()
                : null}
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
