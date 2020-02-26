/*eslint-disable*/
import React from 'react';
import { campaign } from '../config';
import styles from './Campaign.module.css';

const CAMPAIGN_STATE = ['Fundraising', 'Expired', 'Successful'];

class Campaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignDetails: {
        campaignDesc: '',
        campaignStarter: '',
        campaignTitle: '',
        deadline: '',
        currentAmount: '',
        totalFunded: '',
        currentState: null,
        goalAmount: '',
        contract: {},
        address: '',
        _photoHash: '',
      },
      fundAmount: 0,
    };
  }

  componentDidMount = () => {
    const { web3 } = this.props;
    if (web3) {
      this.getCampaign();
    }
  };

  componentDidUpdate(prevProps) {
    const { web3 } = this.props;
    if (web3 !== prevProps.web3) {
      this.getCampaign();
    }
  }

  getRefund = () => {
    const { account } = this.props;
    const { campaignDetails } = this.state;

    if (campaignDetails.currentState !== 1) {
      console.log('state must be expired in order to receive funds');
      return;
    }

    campaignDetails.contract.methods.getRefund().send({
      from: account,
    });
  };

  getCampaign = async () => {
    const { web3, match } = this.props;

    const campaignAddress = match.params.address;
    const campaignInst = new web3.eth.Contract(campaign.ABI, campaignAddress);
    const campaignDetails = await campaignInst.methods.getDetails().call();
    campaignDetails.address = campaignAddress;
    campaignDetails.contract = campaignInst;
    campaignDetails.deadline = new Date(
      campaignDetails.deadline * 1000,
    ).toLocaleString({ dateStyle: 'full' }); // convert to local time
    // convert wei to ether
    campaignDetails.goalAmount = web3.utils.fromWei(
      campaignDetails.goalAmount,
      'ether',
    );
    campaignDetails.currentAmount = web3.utils.fromWei(
      campaignDetails.currentAmount,
      'ether',
    );
    campaignDetails.totalFunded = web3.utils.fromWei(
      campaignDetails.totalFunded,
      'ether',
    );
    campaignDetails.currentState = parseInt(campaignDetails.currentState);
    this.setState({ campaignDetails });
  };

  fundCampaign = () => {
    const { account, web3 } = this.props;
    const { fundAmount, campaignDetails } = this.state;
    if (!fundAmount) {
      return;
    }

    const campaignContract = campaignDetails.contract;

    campaignContract.methods
      .contribute()
      .send({
        from: account,
        value: web3.utils.toWei(fundAmount, 'ether'),
      })
      .then(res => {
        // get the new total
        const newTotal = web3.utils.fromWei(
          res.events.FundingReceived.returnValues.totalFunded,
          'ether',
        );

        // get the new state
        const newState = parseInt(
          res.events.FundingReceived.returnValues.currentState,
        );

        const { campaignDetails } = this.state;
        const newCampaignDetails = { ...campaignDetails };
        newCampaignDetails.currentState = newState;
        newCampaignDetails.totalFunded = newTotal;
        console.log('this is the new campaign details', newCampaignDetails);

        this.setState({ campaignDetails: newCampaignDetails });
      });
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({
      [`${e.target.name}`]: e.target.value,
    });
  };

  render() {
    const { campaignDetails, fundAmount } = this.state;
    console.log(this.state);
    return (
      <>
        <div className={styles.container}>
          <div>
            <div className={styles.item}>
              State: {CAMPAIGN_STATE[campaignDetails.currentState]}
            </div>
            <div className={styles.item}>
              Campaign Title: {campaignDetails.campaignTitle}
            </div>
            <div className={styles.item}>
              Campaign Description: {campaignDetails.campaignDesc}
            </div>
            <div className={styles.item}>
              Campaign Creator: {campaignDetails.campaignStarter}
            </div>
            <div className={styles.item}>
              Days until Expiration: {campaignDetails.deadline}
            </div>
            <div className={styles.item}>
              Funding Goal: {campaignDetails.goalAmount}
            </div>
            <div className={styles.item}>
              Total Funds: {campaignDetails.totalFunded}
            </div>
            <div>
              <input
                type="number"
                value={fundAmount}
                onChange={this.handleChange}
                name="fundAmount"
              />
            </div>
            <button
              type="button"
              className={styles.button}
              onClick={this.fundCampaign}
            >
              Contribute
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={this.getRefund}
              disabled={campaignDetails.currentState !== 1}
            >
              Get Refund
            </button>
          </div>
          <div className={styles.itemImage}>
            <img
              alt="campaign"
              src={`https://ipfs.io/ipfs/${campaignDetails._photoHash}`}
            />
          </div>
        </div>
      </>
    );
  }
}

export default Campaign;
