import React from 'react';
import { Link } from 'react-router-dom';
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
      element.address.substring(0, len).toLowerCase() === input.toLowerCase() ||
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
          <div className={styles.center}>
            <div
              style={{
                width: '260px',
                border: '1px solid grey',
              }}
            >
              <Link
                to={`/campaigns/${element.address}`}
                className={styles.searchRes}
                style={{ textDecoration: 'none' }}
              >
                <div>
                  <img
                    alt="campaign"
                    src={`https://ipfs.io/ipfs/${element._photoHash}`}
                    className={styles.searchImages}
                  />
                </div>
                <div
                  style={{
                    width: '110px',
                    height: '75px',
                    backgroundColor: 'lightGray',
                  }}
                >
                  <h3>{element.campaignTitle}</h3>
                </div>
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
      <div className={styles.center}>
        {loading ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20%',
            }}
          >
            <div className={styles.spin}>
              <svg
                height="50px"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="spinner"
                className="svg-inline--fa fa-spinner fa-w-16"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#adabab"
                  d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
                />
              </svg>
            </div>
          </div>
        ) : (
          <div>
            <div id={styles.search}>
              <SearchIcon
                style={{
                  borderTop: '1px solid rgb(208,208,208)',
                  borderLeft: '1px solid rgb(208,208,208)',
                  borderBottom: '1px solid rgb(208,208,208)',
                  padding: '6.75px',
                }}
              />
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
