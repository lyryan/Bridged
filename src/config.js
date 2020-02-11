import crowdfundingJson from '../truffle/build/contracts/Crowdfunding.json';
import campaignJson from '../truffle/build/contracts/Campaign.json';
import storageJson from '../truffle/build/contracts/Storage.json';

const getCrowdfundingAddress = () => {
  const json = JSON.stringify(crowdfundingJson);
  return JSON.parse(json).networks[5777].address;
};

const getCrowdfundingABI = () => {
  const json = JSON.stringify(crowdfundingJson);
  return JSON.parse(json).abi;
};

const getCampaignABI = () => {
  const json = JSON.stringify(campaignJson);
  return JSON.parse(json).abi;
};

const getStorageABI = () => {
  const json = JSON.stringify(storageJson);
  return JSON.parse(json).abi;
};

const getStorageAddress = () => {
  const json = JSON.stringify(storageJson);
  return JSON.parse(json).networks[5777].address;
};

export const crowdfunding = {
  ADDRESS: getCrowdfundingAddress(),
  ABI: getCrowdfundingABI(),
};

export const campaign = {
  ABI: getCampaignABI(),
};

export const storage = {
  ADDRESS: getStorageAddress(),
  ABI: getStorageABI(),
};
