/* eslint-disable */
const Migrations = artifacts.require('Migrations');
const Addition = artifacts.require('Addition');
const Crowdfunding = artifacts.require('Crowdfunding');
const Project = artifacts.require('Project');
const SafeMath = artifacts.require('SafeMath');

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Addition);
  deployer.deploy(Crowdfunding);
  deployer.deploy(SafeMath);
  deployer.deploy(Project);
  deployer.link(SafeMath, Crowdfunding); // use SafeMath Library with Crowdfunding Contract
  deployer.link(SafeMath, Project); // use SafeMath with Project Contract
};
