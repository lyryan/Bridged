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

  /*static getDerivedStateFromProps(props, state) {
    console.log('in get derived state from props');
    console.log(props);
    console.log(state);
  }*/

  getCampaigns = () => {
    console.log(this.props);
    console.log(this.props.web3);
    const crowdfundInstance = new this.props.web3.eth.Contract(
      crowdfunding.ABI,
      crowdfunding.ADDRESS,
    );

    crowdfundInstance.methods
      .returnAllCampaigns()
      .call()
      .then(campaigns => {
        console.log('these are all the campaigns being returned', campaigns);
        campaigns.forEach(campaignAddress => {
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
              this.setState({
                campaigns: [...this.state.campaigns, campaignInfo],
              });
            });
        });
      });
  };

  componentDidMount = async () => {
    this.getCampaigns();
  };

  render() {
    return <div>Home</div>;
  }
}

export default Explore;
