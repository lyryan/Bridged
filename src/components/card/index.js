import React from 'react';
import { Link } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import { lighten, withStyles } from '@material-ui/core/styles';

import styles from './index.module.css';

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten('#6ca880', 0.5),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#6ca880',
  },
})(LinearProgress);

const getTimeRemaining = date => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const msPerHour = 1000 * 60 * 60;

  const todayDate = new Date(new Date().toUTCString());

  const expiryDate = new Date(date);

  const timeRemaining = expiryDate - todayDate;

  if (timeRemaining < msPerDay) {
    const hoursRemaining = Math.floor(timeRemaining / msPerHour);
    return {
      str: hoursRemaining === 1 ? 'HOUR TO GO' : 'HOURS TO GO',
      val: hoursRemaining <= 0 ? 0 : hoursRemaining,
    };
  }

  const daysRemaining = Math.floor(timeRemaining / msPerDay);
  return {
    str: daysRemaining === 1 ? 'DAY TO GO' : 'DAYS TO GO',
    val: daysRemaining > 30 ? '>30' : daysRemaining,
  };
};

const Card = props => {
  const {
    campaignHash,
    campaignTitle,
    campaignDesc,
    campaignCreator,
    expiryDate,
    fundingGoal,
    route,
    totalFunded,
    backers,
  } = props;

  let button;
  if (route) {
    button = (
      <Link to={route}>
        <button type="button" className={styles.button}>
          View Campaign &raquo;
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
      <div className={styles.item}>
        <div className={styles.mainHeading}>Campaign</div>
        <div className={styles.title}>{campaignTitle}</div>
      </div>
      <div className={styles.description}>
        {campaignDesc.length < 73
          ? campaignDesc
          : campaignDesc.substr(0, 73).concat('...')}
      </div>
      <div className={styles.item}>
        <div className={styles.campaignCreator}>Created by</div>
        <div className={styles.creator}>{campaignCreator}</div>
      </div>
      <div className={styles.item}>
        <div className={styles.fundingGoal}>{fundingGoal} Ethers</div>
      </div>
      <BorderLinearProgress
        variant="determinate"
        value={
          totalFunded / fundingGoal > 1
            ? 100
            : (totalFunded / fundingGoal) * 100
        }
      />
      <div className={styles.infoContainer}>
        <div>
          <span className={styles.info}>{backers}</span>
          <span className={styles.mainHeading}>BACKERS</span>
        </div>
        <div>
          <span className={styles.info}>
            {getTimeRemaining(expiryDate).val}
          </span>
          <span className={styles.mainHeading}>
            {getTimeRemaining(expiryDate).str}
          </span>
        </div>
      </div>
      {button}
    </div>
  );
};

export default Card;
