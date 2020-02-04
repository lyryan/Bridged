/* eslint-disable */

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

  getCampaigns = () => {
    const crowdfundInstance = new this.props.web3.eth.Contract(
      crowdfunding.ABI,
      crowdfunding.ADDRESS,
    );

    crowdfundInstance.methods
      .returnAllCampaigns()
      .call()
      .then(async allCampaigns => {
        console.log('these are all the campaigns being returned', allCampaigns);
        const promises = allCampaigns.map(async campaignAddress => {
          const campaignInst = new this.props.web3.eth.Contract(
            campaign.ABI,
            campaignAddress,
          );

          let campaignInfo;
          await campaignInst.methods
            .getDetails()
            .call()
            .then(campaignData => {
              campaignInfo = campaignData;
              campaignInfo.contract = campaignInst;
            });

          return campaignInfo;
        });

        const campaigns = await Promise.all(promises);
        this.setState({ campaigns });
      });
  };

  componentDidUpdate(prevProps) {
    if (this.props.web3 !== prevProps.web3) {
      this.getCampaigns();
    }
  }

  componentDidMount = () => {
    if (this.props.web3) {
      this.getCampaigns();
    }
  };

  showAllCampaigns = () => {
    return this.state.campaigns.map((el, index) => {
      return (
        <Card
          key={index}
          campaignTitle={el.campaignTitle}
          campaignDesc={el.campaignDesc}
          campaignCreator={el.campaignStarter}
          daysUntilExpiration={el.deadline}
          fundingGoal={el.goalAmount}
          route={`/campaigns/${el.campaignTitle
            .replace(/ /g, '-')
            .toLowerCase()}`}
        />
      );
    });
  };

  componentDidMount = () => {
    if (this.props.web3) {
      this.getCampaigns();
    }
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
