/* eslint-disable */
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = {
  form: {
    '& > *': {
      width: 500,
      margin: 10,
    },
    display: 'flex',
    flexDirection: 'row',
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
    width: 300,
  },
  formField: {
    width: 300,
  },
};

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer: '',
      imgSrc: null,
    };
  }

  processFile = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      imgSrc: URL.createObjectURL(e.target.files[0]),
    });
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  };

  convertToBuffer = async reader => {
    // Convert file to a buffer to upload to IPFS
    const buffer = await Buffer.from(reader.result);
    this.props.setBuffer(buffer);
  };

  render() {
    const {
      classes,
      data,
      handleChange,
      handleSubmit,
      handleBufferChange,
    } = this.props;

    return (
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
            />
            <TextField
              className={classes.formField}
              label="Days to Expiration"
              name="daysUntilExpiration"
              color="primary"
              type="number"
              onChange={handleChange}
              value={data.daysUntilExpiration}
            />
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              type="submit"
            >
              Create Campaign
            </Button>
          </div>
          <div>
            <img
              style={{ width: '300px' }}
              src={this.state.imgSrc}
              alt="Preview"
            />
            <input type="file" onChange={this.processFile} />
          </div>
        </form>
      </div>
    );
  }
}

export default withStyles(useStyles)(Form);
