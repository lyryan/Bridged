import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { crowdfunding, campaign } from '../config';
import Card from '../components/card';
import styles from './Home.module.css';
import handsIcon from '../images/landing-header.png';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: [],
      // loading: true,
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
    // this.setState({ loading: true });
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

        if (campaigns.length > 6) {
          const len = campaigns.length;
          campaigns.splice(0, len - 6);
        }
        this.setState({ campaigns });
      });
    // this.setState({ loading: false });
  };

  renderCards = () => {
    const { web3 } = this.props;
    const { campaigns } = this.state;

    return campaigns.map(el => {
      const options = { dateStyle: 'full' };
      const expiryDate = new Date(el.deadline * 1000).toLocaleString(options); // convert to local time
      const goalAmount = web3.utils.fromWei(el.goalAmount, 'ether'); // convert wei to ether
      return (
        <div key={el.address}>
          <Card
            campaignHash={el._photoHash}
            campaignTitle={el.campaignTitle}
            campaignDesc={el.campaignDesc}
            campaignCreator={el.campaignStarter}
            deadline={expiryDate}
            fundingGoal={goalAmount}
            route={`/campaigns/${el.address}`}
          />
        </div>
      );
    });
  };

  render() {
    return (
      <div>
        <div className={styles.top}>
          <span className={styles.col}>
            <img src={handsIcon} alt="" />
          </span>
          <span className={styles.col}>
            <h1>Tired of campaigns not delivering as promised?</h1>
            <p>
              Bridged is a socially-driven crowdfunding platform built on the
              Ethereum blockchain, offering more control to the masses and less
              worry over undelivered promises.
            </p>
            <Link style={{ textDecoration: 'none' }} to="/create-campaign">
              <button type="button">Get Started</button>
            </Link>
          </span>
        </div>

        <div className={styles.middle}>
          <h3>Featured Campaigns</h3>
          <div>
            <Carousel
              infinite
              autoPlay
              autoPlaySpeed={3000}
              transitionDuration={500}
              responsive={responsive}
              draggable
              itemClass={styles.itemClass}
              containerClass={styles.containerClass}
            >
              {this.renderCards()}
            </Carousel>
          </div>
        </div>

        <div className={styles.bottom}>
          <h3>Discover more campaigns on Bridged.</h3>
          <Link style={{ textDecoration: 'none' }} to="/explore">
            <button type="button">View More</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Home;
