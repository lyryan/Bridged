/* eslint-disable */
import React from 'react';
import { storage } from '../../config';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ipfsHash: null,
      buffer: '',
      transactionHash: '',
    };
  }

  processFile = e => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  convertToBuffer = async reader => {
    // Convert file to a buffer to upload to IPFS
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer });
  };

  onSubmit = async e => {
    e.preventDefault();
    const { web3, account, ipfs } = this.props;
    const storageInstance = new web3.eth.Contract(storage.ABI, storage.ADDRESS);

    await ipfs.add(this.state.buffer, (err, ipfsHash) => {
      console.log(err, ipfsHash);
      this.setState({ ipfsHash: ipfsHash[0].hash });
      storageInstance.methods.set(this.state.ipfsHash).send(
        {
          from: account,
        },
        (error, transactionHash) => {
          console.log('Transaction hash: ', transactionHash);
          this.setState({ transactionHash });
        },
      );
    });
  };

  render() {
    return (
      <div>
        <h4> Image Upload: </h4>
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.processFile} />
          <button type="submit"> Upload </button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Values</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>IPFS Hash</td>
              <td>{this.state.ipfsHash}</td>
            </tr>
            <tr>
              <td>Storage Contract Address</td>
              <td>{storage.ADDRESS}</td>
            </tr>
            <tr>
              <td>Transaction Hash</td>
              <td>{this.state.transactionHash}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
export default FileUpload;
