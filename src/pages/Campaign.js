/* eslint-disable */
import React, { Fragment } from 'react';
import { campaign } from '../config';
import styles from './Campaign.module.css';

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
      <Fragment>
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
      </Fragment>
    );
  }
}

export default Campaign;
