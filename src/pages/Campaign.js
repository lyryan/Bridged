/* eslint-disable */
import React from 'react';
import { campaign } from '../config';

class Campaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignDetails: {
        address: '',
        contract: {},
      },
    };
  }

  getCampaign = async () => {
    const campaignAddress = this.props.match.params.address;
    const campaignInst = new this.props.web3.eth.Contract(
      campaign.ABI,
      campaignAddress,
    );
    let campaignDetails = await campaignInst.methods.getDetails().call();
    campaignDetails.address = campaignAddress;
    campaignDetails.contract = campaignInst;
    this.setState({ campaignDetails });
  };

  componentDidMount = () => {
    if (this.props.web3) {
      this.getCampaign();
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.web3 !== prevProps.web3) {
      this.getCampaign();
    }
  }

  render() {
    const { campaignDetails } = this.state;
    return (
      <div>
        <div>Campaign Title: {campaignDetails.campaignTitle} </div>
        <div>Campaign Description: {campaignDetails.campaignDesc}</div>
        <div>Campaign Creator: {campaignDetails.campaignStarter}</div>
        <div>Days until Expiration: {campaignDetails.deadline}</div>
        <div>Funding Goal: {campaignDetails.goalAmount}</div>
      </div>
    );
  }
}

export default Campaign;
