import React from 'react';
import { crowdfunding, campaign } from '../config';
import Card from '../components/card';
import styles from './Explore.module.css';

class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: [],
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

  getCampaigns = () => {
    const { web3 } = this.props;
    const crowdfundInstance = new web3.eth.Contract(
      crowdfunding.ABI,
      crowdfunding.ADDRESS,
    );

    crowdfundInstance.methods
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

  render() {
    return (
      <div>
        <div className={styles.cardContainer}>{this.showAllCampaigns()}</div>
      </div>
    );
  }
}

export default Explore;
