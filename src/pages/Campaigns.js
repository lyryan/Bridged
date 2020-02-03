/* eslint-disable */

import React from 'react';
import Form from '../components/form';
import crowdfundingJson from '../../truffle/build/contracts/Crowdfunding.json';

const crowdfund_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'contractAddress',
        type: 'address',
      },
      {
        indexed: false,
        name: 'campaignCreator',
        type: 'address',
      },
      {
        indexed: false,
        name: 'campaignTitle',
        type: 'string',
      },
      {
        indexed: false,
        name: 'campaignDesc',
        type: 'string',
      },
      {
        indexed: false,
        name: 'deadline',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'goalAmount',
        type: 'uint256',
      },
    ],
    name: 'CampaignCreated',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'title',
        type: 'string',
      },
      {
        name: 'description',
        type: 'string',
      },
      {
        name: 'durationInDays',
        type: 'uint256',
      },
      {
        name: 'goalAmount',
        type: 'uint256',
      },
    ],
    name: 'startCampaign',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'returnAllCampaigns',
    outputs: [
      {
        name: '',
        type: 'address[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

const getCrowdfundAddress = () => {
  let json = JSON.stringify(crowdfundingJson);
  return JSON.parse(json).networks[5777].address;
};

// address of the addition smart contract
const crowdfund_address = getCrowdfundAddress();

class Campaign extends React.Component {
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

  startCampaign = () => {
    const crowdfundInstance = new window.web3.eth.Contract(
      crowdfund_ABI,
      crowdfund_address,
    );
    crowdfundInstance.methods
      .startCampaign(
        this.state.newCampaign.title,
        this.state.newCampaign.description,
        this.state.newCampaign.daysUntilExpiration,
        web3.utils.toWei(this.state.newCampaign.fundingGoal, 'ether'),
      )
      .send({
        from: this.props.account,
      })
      .then(res => {
        const campaignInfo = res.events.CampaignStarted.returnValues; // event object
        campaignInfo.isLoading = false;
        campaignInfo.currentAmount = 0;
        campaignInfo.currentState = 0;
        campaignInfo.contract = new window.web3.eth.Contract(
          campaign_ABI,
          campaign_address,
        );
        this.setState({ campaigns: [...this.state.campaigns, campaignInfo] });
      });
  };

  render() {
    const { newCampaign } = this.state;
    return (
      <div>
        <Form data={newCampaign} />{' '}
        {/*pass in a function that changes state in this component*/}
      </div>
    );
  }
}

export default Campaign;
