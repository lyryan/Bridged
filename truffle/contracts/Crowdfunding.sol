// We will be using Solidity version 0.5.4
pragma solidity 0.5.4;

// Importing SafeMath Implementation
//import { SafeMath } from "../libraries/SafeMath.sol";
import "../libraries/SafeMath.sol";
import "./Project.sol";


contract Crowdfunding {
    using SafeMath for uint256;

    // List of existing projects
    Project[] private projects;

    // Event that will be emitted whenever a new project is started
    event ProjectCreated(
        address contractAddress,
        address projectCreator,
        string projectTitle,
        string projectDesc,
        uint256 deadline,
        uint256 goalAmount
    );

    /** @dev Function to start a new project.
      * @param title Title of the project to be created
      * @param description Brief description about the project
      * @param durationInDays Project deadline in days
      * @param goalAmount Project goal in wei
      */
    function startProject(
        string calldata title,
        string calldata description,
        uint durationInDays,
        uint goalAmount
    ) external {
        uint deadline = now.add(durationInDays.mul(1 days));
        Project newProject = new Project(msg.sender, title, description, deadline, goalAmount);
        projects.push(newProject);
        emit ProjectCreated(
            address(newProject),
            msg.sender,
            title,
            description,
            deadline,
            goalAmount
        );
    }                                                                                                                                   

    /** @dev Function to get all projects' contract addresses.
      * @return A list of all projects' contract addreses
      */
    function returnAllProjects() external view returns(Project[] memory){
        return projects;
    }
}