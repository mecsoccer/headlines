import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { DialogTitle, DialogContent, DialogActions, DialogContentText } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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

export default function LayoutTextFields(props) {
  const classes = useStyles();

  return (
    <div className={classes.container} style={{padding:'0 5px 30px'}}>
        <DialogTitle id="form-dialog-title">Delete A Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product with the name 'product'. Click 'cancel' to go back or Click
            'delete' to delete the product permanently.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => props.closeDialog()}>
            Cancel
          </Button>
          <Button color="secondary">
            Delete
          </Button>
        </DialogActions>
    </div>
  );
}
