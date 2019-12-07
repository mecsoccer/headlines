import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';

export default function FormDialog(props) {
  return (
    <div>
      <Dialog open={true} aria-labelledby="form-dialog-title">
        <div style={{display:'flex',justifyContent:'flex-end',padding:5}}>
          <CloseIcon style={{color:'red',cursor:'pointer',margin:'25px 25px 0'}} onClick={() => props.closeDialog()}/>
        </div>
        {props.content}
        {props.children}
      </Dialog>
    </div>
  );
}
