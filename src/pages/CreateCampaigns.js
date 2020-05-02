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
        imgSrc: null,
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

  convertToBuffer = async reader => {
    // Convert file to a buffer to upload to IPFS
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer });
  };

  processFile = e => {
    e.preventDefault();
    e.stopPropagation();
    const formData = this.state.formData;

    formData.imgSrc = URL.createObjectURL(e.target.files[0]);
    this.setState(
      { formData },
      console.log('this is the new state', this.state),
    );

    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
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

        const resetForm = {
          title: '',
          description: '',
          fundingGoal: '',
          selectedDeadline: new Date().setSeconds(0),
          imgSrc: null,
        };

        this.setState({ formData: resetForm, buffer: '' });
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
            processFile={this.processFile}
            handleDateChange={this.handleDateChange}
          />
        </div>
      </div>
    );
  }
}

export default CreateCampaign;
