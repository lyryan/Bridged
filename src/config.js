import crowdfundingJson from '../truffle/build/contracts/Crowdfunding.json';
import campaignJson from '../truffle/build/contracts/Campaign.json';

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

export const crowdfunding = {
  ADDRESS: getCrowdfundingAddress(),
  ABI: getCrowdfundingABI(),
};

export const campaign = {
  ABI: getCampaignABI(),
};
