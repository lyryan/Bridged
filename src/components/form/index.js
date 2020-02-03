import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = {
  form: {
    '& > *': {
      width: 200,
      margin: 10,
    },
    display: 'flex',
    flexDirection: 'column',
    '& label.Mui-focused': {
      color: '#4BA173',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#4BA173',
    },
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 500,
  },
  button: {
    backgroundColor: '#4BA173',
    '&:hover': {
      background: 'rgba(75, 161, 115, 0.9)',
    },
  },
  formField: {
    width: 300,
  },
};

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignName: '',
      campaignDesc: '',
      fundingGoal: '',
      daysToExpiration: '',
    };
  }

  /* campaign is the parent */
  /* every time handle change is invoked, you call the function passed in from campaign.js, that function will change campaigns state */
  /* Then we will be using the props to fill in the fields */
  handleChange = e => {
    console.log({
      [`${e.target.name}`]: e.target.value,
    });
    this.setState({
      [`${e.target.name}`]: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const 
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <form
          className={classes.form}
          onSubmit={e => {
            this.handleSubmit(e);
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            className={classes.formField}
            label="Campaign Name"
            name="campaignName"
            color="primary"
            onChange={this.handleChange}
            width="20"
          />
          <TextField
            className={classes.formField}
            label="Campaign Description"
            name="campaignDesc"
            color="primary"
            multiline
            onChange={this.handleChange}
          />
          <TextField
            className={classes.formField}
            label="Funding Goal"
            name="fundingGoal"
            color="primary"
            onChange={this.handleChange}
          />
          <TextField
            className={classes.formField}
            label="Days to Expiration"
            name="daysToExpiration"
            color="primary"
            onChange={this.handleChange}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Create Campaign
          </Button>
        </form>
      </div>
    );
  }
}

export default withStyles(useStyles)(Form);
