/*eslint-disable*/
import React from 'react';
import { campaign } from '../config';
import styles from './Campaign.module.css';

const CAMPAIGN_STATE = ['Fundraising', 'Successful', 'Expired'];

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
        currentState: 0,
        goalAmount: '',
        contract: {},
        address: '',
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
    if (this.state.campaignDetails.currentState !== 2) {
      console.log('state must be expired in order to receive funds');
      return;
    }
    this.state.campaignDetails.contract.methods.getRefund().send({
      from: this.props.account,
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
    this.setState({ campaignDetails });
  };

  fundCampaign = () => {
    if (!this.state.fundAmount) {
      return;
    }

    const campaignContract = this.state.campaignDetails.contract;

    campaignContract.methods
      .contribute()
      .send({
        from: this.props.account,
        value: this.props.web3.utils.toWei(this.state.fundAmount, 'ether'),
      })
      .then(res => {
        console.log('sending funds promise, thhis is the return value', res);
        const newTotal = parseInt(
          res.events.FundingReceived.returnValues.currentTotal,
          10,
        );
        const campaignGoal = parseInt(
          this.state.campaignDetails.goalAmount,
          10,
        );
        this.state.campaignDetails.currentAmount = newTotal;

        // Set project state to success
        if (newTotal >= campaignGoal) {
          this.state.campaignDetails.currentState = 1;
        }
      });
  };

  getRefund = () => {};

  handleChange = e => {
    e.preventDefault();
    this.setState({
      [`${e.target.name}`]: e.target.value,
    });
  };

  render() {
    const { campaignDetails } = this.state;
    return (
      <>
        <div className={styles.container}>
          <div className={styles.itemContainer}>
            <div className={styles.item}>
              State: {CAMPAIGN_STATE[campaignDetails.currentState]}
            </div>
            <div className={styles.item}>
              Campaign Title: {campaignDetails.campaignTitle}{' '}
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
              Current Amount: {campaignDetails.currentAmount}
            </div>
            <div>
              <input
                type="number"
                value={this.state.fundAmount}
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
              disabled={campaignDetails.currentState !== 2}
              onClick={this.getRefund()}
            >
              Get Refund
            </button>
          </div>
          <div className={styles.itemImage}>Image</div>
        </div>
        <div>Campaign Info</div>
      </>
    );
  }
}

export default Campaign;
