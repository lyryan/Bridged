import React from 'react';
import { lighten, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { campaign } from '../config';
import styles from './Campaign.module.css';
import Loader from '../components/loader';

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten('#6ca880', 0.5),
    borderTopRightRadius: '8px',
    borderBottomRightRadius: '8px',
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#6ca880',
  },
})(LinearProgress);

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
      loading: true,
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
    this.setState({ loading: true });
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
    campaignDetails.currentState = parseInt(campaignDetails.currentState, 10);
    this.setState({ campaignDetails }, this.setState({ loading: false }));
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
          10,
        );

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
    const { campaignDetails, fundAmount, loading } = this.state;
    let status = (
      <div className={styles.fundraising}>
        Expires {campaignDetails.deadline}
      </div>
    );
    if (campaignDetails.currentState === 1) {
      status = <div className={styles.expired}>Expired</div>;
    } else if (campaignDetails.currentState === 2) {
      status = <div className={styles.succeeded}>Succeeded</div>;
    }
    return (
      <>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.container}>
              <Loader />
            </div>
          ) : (
            <>
              <div className={styles.info}>
                {status}
                {/* <div className={styles.item}>
              State: {CAMPAIGN_STATE[campaignDetails.currentState]}
            </div> */}
                <div className={[styles.item, styles.title].join(' ')}>
                  {campaignDetails.campaignTitle}
                </div>
                {/* <div className={styles.item}>
              Campaign Address: {campaignDetails.address}
            </div> */}
                <div className={[styles.item, styles.description].join(' ')}>
                  {campaignDetails.campaignDesc}
                </div>
                <div className={[styles.item, styles.grey].join(' ')}>
                  {/* Creator Address: {campaignDetails.campaignStarter} */}
                  Created by:
                </div>
                <div className={[styles.item, styles.creator].join(' ')}>
                  {campaignDetails.campaignStarter}
                </div>

                <div className={styles.item} style={{ marginBottom: '3%' }}>
                  {/* Total Funds: {campaignDetails.totalFunded} */}
                  <span className={styles.title}>
                    {campaignDetails.totalFunded} Ethers
                  </span>
                  <span className={styles.grey} style={{ fontSize: '110%' }}>
                    {' '}
                    of {campaignDetails.goalAmount} Ethers goal
                  </span>
                </div>
                {/* <div className={styles.item}>
              Funding Goal: {campaignDetails.goalAmount}
            </div> */}

                <BorderLinearProgress
                  className={styles.progressBar}
                  variant="determinate"
                  color="secondary"
                  value={
                    campaignDetails.totalFunded / campaignDetails.goalAmount > 1
                      ? 100
                      : (campaignDetails.totalFunded /
                          campaignDetails.goalAmount) *
                        100
                  }
                />
                <div className={styles.buttons}>
                  {campaignDetails.currentState === 0 ? (
                    <>
                      <input
                        type="number"
                        value={fundAmount}
                        onChange={this.handleChange}
                        name="fundAmount"
                        className={styles.donate}
                      />
                      <button
                        type="button"
                        className={styles.button}
                        onClick={this.fundCampaign}
                        disabled={campaignDetails.currentState !== 0}
                      >
                        Contribute
                      </button>
                    </>
                  ) : null}
                  {campaignDetails.currentState !== 0 ? (
                    <button
                      type="button"
                      className={styles.button}
                      onClick={this.getRefund}
                      disabled={campaignDetails.currentState !== 1}
                    >
                      Get Refund
                    </button>
                  ) : null}
                </div>
              </div>
              <div className={styles.itemImage}>
                <img
                  className={styles.campaignPicture}
                  alt="campaign"
                  src={`https://ipfs.io/ipfs/${campaignDetails._photoHash}`}
                />
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

export default Campaign;
