/* eslint-disable */
import React from 'react';
import Form from '../components/form';
import { crowdfunding, campaign } from '../config';

class CreateCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        title: '',
        description: '',
        fundingGoal: '',
        daysUntilExpiration: '',
      },
      buffer: '',
    };
  }

  handleChange = e => {
    const { formData } = this.state;
    const newData = { ...formData };
    const [field, value] = [e.target.name, e.target.value];
    newData[field] = value;
    this.setState({ formData: newData });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.startCampaign();
  };

  pushToIPFS = e => {
    const { ipfs } = this.props;
    return new Promise((resolve, reject) => {
      ipfs.add(this.state.buffer, (err, ipfsHash) => {
        resolve(ipfsHash[0].hash);
      });
    });
  };

  startCampaign = async () => {
    const { web3, account } = this.props;
    const { formData } = this.state;

    const ipfsHash = await this.pushToIPFS();

    const crowdfundInstance = new web3.eth.Contract(
      crowdfunding.ABI,
      crowdfunding.ADDRESS,
    );

    crowdfundInstance.methods
      .startCampaign(
        formData.title,
        formData.description,
        formData.daysUntilExpiration,
        web3.utils.toWei(formData.fundingGoal, 'ether'),
        ipfsHash,
      )
      .send({
        from: account,
      })
      .then(res => {
        console.log('this is the response object', res);
        const campaignInfo = res.events.CampaignCreated.returnValues; // event object
        campaignInfo.currentAmount = 0;
        campaignInfo.currentState = 0;
        campaignInfo.contract = new web3.eth.Contract(
          campaign.ABI,
          res.events.CampaignCreated.returnValues.contractAddress,
        );
      });
  };

  render() {
    const { formData } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <div>
          <Form
            data={formData}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            setBuffer={buffer => this.setState({ buffer })}
          />
        </div>
      </div>
    );
  }
}

export default CreateCampaign;
