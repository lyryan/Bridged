/* eslint-disable */
const Migrations = artifacts.require('Migrations');
const Addition = artifacts.require('Addition');
const Crowdfunding = artifacts.require('Crowdfunding');
const SafeMath = artifacts.require('SafeMath');

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Addition);
  deployer.deploy(Crowdfunding);
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, Crowdfunding); // use SafeMath Library with Crowdfunding Contract
};
