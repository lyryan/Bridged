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

const Card = props => {
  const {
    campaignHash,
    campaignTitle,
    campaignDesc,
    campaignCreator,
    deadline,
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
      <div className={styles.description}>{campaignDesc}</div>
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
          <span className={styles.info}>{deadline}</span>
          <span className={styles.mainHeading}>DAYS TO GO</span>
        </div>
      </div>
      {button}
    </div>
  );
};

export default Card;
