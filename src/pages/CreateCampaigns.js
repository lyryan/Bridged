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
        selectedDeadline: new Date().setSeconds(0),
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

  handleDateChange = date => {
    const { formData } = this.state;
    const newData = { ...formData };
    newData.selectedDeadline = date;
    this.setState({ formData: newData });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.startCampaign();
  };

  pushToIPFS = () => {
    const { ipfs } = this.props;
    return new Promise((resolve, reject) => {
      const { buffer } = this.state;
      ipfs.add(buffer, (err, ipfsHash) => {
        if (err) return reject(err);
        return resolve(ipfsHash[0].hash);
      });
    });
  };

  setBuffer = buffer => {
    this.setState({ buffer });
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
        Date.parse(formData.selectedDeadline) / 1000,
        web3.utils.toWei(formData.fundingGoal, 'ether'),
        ipfsHash,
      )
      .send({
        from: account,
      })
      .then(res => {
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
            setBuffer={this.setBuffer}
            handleDateChange={this.handleDateChange}
          />
        </div>
      </div>
    );
  }
}

export default CreateCampaign;
