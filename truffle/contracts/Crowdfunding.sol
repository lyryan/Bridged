/* eslint-disable */
// We will be using Solidity version 0.5.4
pragma solidity 0.5.4;

// Importing SafeMath Implementation
//import { SafeMath } from "../libraries/SafeMath.sol";
import '../libraries/SafeMath.sol';
import './Campaign.sol';

contract Crowdfunding {
    using SafeMath for uint256;

    // List of existing campaigns
    Campaign[] private campaigns;

    // Event that will be emitted whenever a new campaign is started
    event CampaignCreated(
        address contractAddress,
        address campaignCreator,
        string campaignTitle,
        string campaignDesc,
        uint256 deadline,
        uint256 goalAmount,
        string photoHash
    );

    /** @dev Function to start a new campaign.
      * @param title Title of the campaign to be created
      * @param description Brief description about the campaign
      * @param durationInDays Campaign deadline in days
      * @param goalAmount Campaign goal in wei
      */
    function startCampaign(
        string calldata title,
        string calldata description,
        uint256 durationInDays,
        uint256 goalAmount,
        string calldata photoHash
    ) external {
        uint256 deadline = now.add(durationInDays.mul(1 days));
        Campaign newCampaign = new Campaign(
            msg.sender,
            title,
            description,
            deadline,
            goalAmount,
            photoHash
        );
        campaigns.push(newCampaign);
        emit CampaignCreated(
            address(newCampaign),
            msg.sender,
            title,
            description,
            deadline,
            goalAmount,
            photoHash
        );
    }

    /** @dev Function to get all campaigns' contract addresses.
      * @return A list of all campaigns' contract addreses
      */
    function returnAllCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }
}
