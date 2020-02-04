/* eslint-disable */

import React from 'react';
import Form from '../components/form';
import { crowdfunding, campaign } from '../config';

class CreateCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newCampaign: {
        title: '',
        description: '',
        fundingGoal: '',
        daysUntilExpiration: '',
      },
      campaigns: [],
    };
  }

  componentDidMount() {
    console.log('in createcampaigns.js');
    console.log(this.props.web3);
  }

  handleChange = e => {
    let newCampaign = { ...this.state.newCampaign };
    const [field, value] = [e.target.name, e.target.value];
    newCampaign[field] = value;
    this.setState({ newCampaign });
  };

  handleSubmit = e => {
    console.log(this.props.web3);

    e.preventDefault();
    this.startCampaign();
  };

  startCampaign = async () => {
    const crowdfundInstance = new this.props.web3.eth.Contract(
      crowdfunding.ABI,
      crowdfunding.ADDRESS,
    );

    crowdfundInstance.methods
      .startCampaign(
        this.state.newCampaign.title,
        this.state.newCampaign.description,
        this.state.newCampaign.daysUntilExpiration,
        this.props.web3.utils.toWei(
          this.state.newCampaign.fundingGoal,
          'ether',
        ),
      )
      .send({
        from: this.props.account,
      })
      .then(res => {
        console.log('this is the response object', res);
        const campaignInfo = res.events.CampaignCreated.returnValues; // event object
        campaignInfo.currentAmount = 0;
        campaignInfo.currentState = 0;
        campaignInfo.contract = new this.props.web3.eth.Contract(
          campaign.ABI,
          res.events.CampaignCreated.returnValues.contractAddress,
        );
        this.setState({ campaigns: [...this.state.campaigns, campaignInfo] });
      });
  };

  render() {
    const { newCampaign } = this.state;

    return (
      <div>
        <Form
          data={newCampaign}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />{' '}
      </div>
    );
  }
}

export default CreateCampaign;
