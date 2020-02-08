import 'date-fns';

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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
  render() {
    const {
      classes,
      data,
      handleChange,
      handleSubmit,
      handleDateChange,
    } = this.props;
    return (
      <div className={classes.root}>
        <form
          className={classes.form}
          onSubmit={handleSubmit}
          noValidate
          autoComplete="off"
        >
          <TextField
            className={classes.formField}
            label="Campaign Name"
            name="title"
            color="primary"
            onChange={handleChange}
            width="20"
            value={data.title}
          />
          <TextField
            className={classes.formField}
            label="Campaign Description"
            name="description"
            color="primary"
            multiline
            onChange={handleChange}
            value={data.description}
          />
          <TextField
            className={classes.formField}
            label="Funding Goal"
            name="fundingGoal"
            color="primary"
            type="number"
            onChange={handleChange}
            value={data.fundingGoal}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              variant="inline"
              label="Set a Deadline"
              value={data.selectedDeadline}
              onChange={handleDateChange}
              onError={console.log}
              disablePast
              format="MM/dd/yyyy hh:mm a"
              minDate={new Date()}
            />
          </MuiPickersUtilsProvider>

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
