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
      width: 500,
      margin: 10,
    },
    position: 'relative',
    flexDirection: 'column',
    '& label.Mui-focused': {
      color: '#4BA173',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#4BA173',
    },
  },
  root: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4BA173',
    '&:hover': {
      background: 'rgba(75, 161, 115, 0.9)',
    },
    width: 200,
    textTransform: 'capitalize',
    display: 'inline-block',
    marginBottom: 50,
  },
  formField: {
    width: 500,
    marginTop: 5,
    marginBottom: 5,
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
      processFile,
    } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'Arial',
            fontSize: '300%',
            fontWeight: '200',
            textAlign: 'center',
            marginTop: '15%',
          }}
        >
          Create life-changing campaigns <br /> in a matter of seconds
        </h1>
        <div className={classes.root}>
          <form
            className={classes.form}
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
          >
            <div>
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
                style={{ marginBottom: '10%' }}
              />
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
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
                  <br />
                  <br />
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Create Campaign
                  </Button>
                </div>
                <div
                  style={{ textAlign: 'center', width: '80%', margin: 'auto' }}
                >
                  <img
                    src={data.imgSrc}
                    style={{
                      display: 'inline-block',
                      width: '80%',
                      height: 'auto',
                      marginTop: '3%',
                      marginBottom: '3%',
                      fontFamily: 'Arial',
                    }}
                  />
                  <input type="file" onChange={processFile} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(Form);
