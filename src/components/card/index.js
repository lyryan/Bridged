import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.css';

const Card = props => {
  const {
    campaignHash,
    campaignTitle,
    campaignDesc,
    campaignCreator,
    deadline,
    fundingGoal,
    route,
  } = props;

  let button;
  if (route) {
    button = (
      <Link to={route}>
        <button type="button" className={styles.button}>
          View Campaign
        </button>
      </Link>
    );
  } else {
    button = null;
  }

  return (
    <div className={styles.card}>
      <div className={styles.campaignImage}>
        <img alt="campaign" src={`https://ipfs.io/ipfs/${campaignHash}`} />
      </div>
      <div>Campaign: {campaignTitle}</div>
      <div>Description: {campaignDesc}</div>
      <div className={styles.campaignCreator}>
        Created by: {campaignCreator}
      </div>
      <div>Expiration Date: {deadline}</div>
      <div>Goal Amount: {fundingGoal} Ethers</div>
      {button}
    </div>
  );
};

export default Card;
