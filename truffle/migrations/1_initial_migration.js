/* eslint-disable */
const Migrations = artifacts.require('Migrations');
const Addition = artifacts.require('Addition');

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Addition);
};
