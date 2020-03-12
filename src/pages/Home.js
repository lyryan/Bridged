import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Item from 'react-bootstrap/CarouselItem';
import { crowdfunding, campaign } from '../config';
import Card from '../components/card';
import styles from './Home.module.css';
import handsIcon from '../images/landing-header.png';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        console.log('the new length is', campaigns.length);
        this.setState({ campaigns });
      });
    // this.setState({ loading: false });
  };

  renderCards = () => {
    const { web3 } = this.props;
    const { campaigns } = this.state;

    const featuredCampaigns = [];

    let i = 0,
      j = 0,
      count = 0;
    while (i < 2 && count < campaigns.length) {
      const item = [];
      while (j < 3 && count < campaigns.length) {
        const el = campaigns[count];
        const options = { dateStyle: 'full' };
        const expiryDate = new Date(el.deadline * 1000).toLocaleString(options); // convert to local time
        const goalAmount = web3.utils.fromWei(el.goalAmount, 'ether'); // convert wei to ether
        console.log('this is the info', el);
        item.push(
          <Card
            key={el.address}
            campaignHash={el._photoHash}
            campaignTitle={el.campaignTitle}
            campaignDesc={el.campaignDesc}
            campaignCreator={el.campaignStarter}
            deadline={expiryDate}
            fundingGoal={goalAmount}
            route={`/campaigns/${el.address}`}
          />,
        );
        count++;
        j++;
      }
      featuredCampaigns.push(
        <Carousel.Item>
          <div className={styles.cardContainer}>{item}</div>
        </Carousel.Item>,
      );
      j = 0;
      i++;
    }
    console.log('these are the featured campaigns', featuredCampaigns);

    return featuredCampaigns;
  };

  render() {
    return (
      <div>
        <div className={styles.top}>
          <span className={styles.col}>
            <img src={handsIcon} alt="" />
          </span>
          <span className={styles.col}>
            <h1>Tired of campaigns failing and not delivering as promised?</h1>
            <p>
              Bridged is a socially driven crowdfunding platform that's built on
              the Ethereum blockchain. No more failed deliver reward promises
            </p>
            <button>Get started</button>
          </span>
        </div>

        <div className={styles.bottom}>
          <h3>Featured Campaigns</h3>
          <Carousel>{this.renderCards()}</Carousel>
        </div>
      </div>
    );
  }
}

export default Home;
