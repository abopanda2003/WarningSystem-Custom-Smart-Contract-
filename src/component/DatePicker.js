import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default class DatePickers extends React.Component {
  render(){
    return (
      <form className={useStyles.container} noValidate>
        <TextField
          id="date"
          type="date"
          onChange={
            (e)=>this.props.parentIns.onDateChange(e.target.value)
          }
          className={useStyles.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    );  
  }
}