/* eslint-disable */

import React from 'react';
import { crowdfunding, campaign } from '../config';

class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: [],
    };
  }

  getCampaigns = async () => {
    console.log(this.props);
    console.log(this.props.web3);
    const crowdfundInstance = new this.props.web3.eth.Contract(
      crowdfunding.ABI,
      crowdfunding.ADDRESS,
    );

    let campaigns = [];

    await crowdfundInstance.methods
      .returnAllCampaigns()
      .call()
      .then(allCampaigns => {
        console.log('these are all the campaigns being returned', allCampaigns);
        allCampaigns.forEach(campaignAddress => {
          const campaignInst = new this.props.web3.eth.Contract(
            campaign.ABI,
            campaignAddress,
          );
          campaignInst.methods
            .getDetails()
            .call()
            .then(campaignData => {
              const campaignInfo = campaignData;
              campaignInfo.contract = campaignInst;
              campaigns.push(campaignInfo);
            });
        });
      });

    this.setState({ campaigns });
  };

  componentDidUpdate(prevProps) {
    if (this.props.web3 !== prevProps.web3) {
      this.getCampaigns();
    }
  }

  showAllCampaigns = () => {
    return this.state.campaigns.map(el => {
      console.log('this is the element', el);
      return (
        <div>
          {el.campaignTitle}
          <br />
          {el.campaignDesc}
        </div>
      );
    });
  };

  render() {
    console.log('getting campaigns', this.state.campaigns);
    return (
      <div>
        Campaigns:
        {this.showAllCampaigns()}
      </div>
    );
  }
}

export default Explore;
