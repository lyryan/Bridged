import React from 'react';
import { campaign } from '../config';
import styles from './Campaign.module.css';

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
        currentState: '',
        goalAmount: '',
        contract: {},
        address: '',
      },
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
    campaignDetails.goalAmount = web3.utils.fromWei(
      campaignDetails.goalAmount,
      'ether',
    ); // convert wei to ether
    this.setState({ campaignDetails });
  };

  render() {
    const { campaignDetails } = this.state;
    return (
      <>
        <div className={styles.container}>
          <div className={styles.itemContainer}>
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
            <button type="button" className={styles.button}>
              Contribute
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
