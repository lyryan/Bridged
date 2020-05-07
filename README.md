<h1 align="center">Bridged - SJSU CMPE-195 Senior Project</h1>

## Project Description
Bridged is a secure crowdfunding platform that integrates the benefits of blockchain technology to bring trust in crowdfunding. 

## Prerequisites

1. Node, ESLint, Prettier, and Ganache installed.
2. In root directory, create a `.env.development` file and input your own Fortmatic key.

*Note: In order to receive funds on Bridged for development purposes, you can send yourself Ether to your Fortmatic address from Metamask. If your wallet is empty on Metamask, there is a workaround by importing a Ganache address on Metamask.*

## How to run the app in development mode
1. In root directory, install dependencies by running `npm install`. Next, CD into the truffle folder and run `npm install` again.
2. Start the client by running `npm run dev`.
3. Go to `localhost:8080` in your browser.
4. Run Ganache and create a workspace.
5. CD into the truffle folder to deploy smart contracts by running `truffle migrate --network development`.

## How the src repo is organized

### components Folder

This is where components are defined for reuse. 

### pages Folder

This contains all pages/routes for the application which is a composite of components.

### images/svg Folder

This contains any static assets. 

### truffle Folder

This contains all functional logic for smart contracts the define our transactions.

## Commit rules

1. Use descriptive commit messages.
2. Active verbs, i.e. `Adds x feature`, `Fixes y bug`
3. Start with a capital. See above.
4. Commit often! Don't change 700 lines and make it into one commit.

## Merging Process

1. Branch off onto your own branch.
2. Lint code by running `npm run lint` once a feature is complete.
3. If lint passes, open a PR into master.
4. Inside the PR, connect issue with Zenhub (download Google Chrome Zenhub extension).
5. Code review.