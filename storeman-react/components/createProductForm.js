import React from 'react';
import axiosInstance from '../apis/storemanager';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';

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
  const [addProductForm, updateProductForm] = React.useState({ quantitySold: 0 });

  const classes = useStyles();

  function onSubmitClick(newProduct) {
    axiosInstance.defaults.headers.common['Authorization'] = sessionStorage.getItem('storeToken');
    axiosInstance.post('/products', newProduct)
      .then((data) => {
        props.closeDialog();
        props.initiateFetchProducts(true);
      })
      .catch(err => console.log(err));
  }

  return (
    <div className={classes.container} style={{padding:'0 5px 30px'}}>
      <DialogTitle id="form-dialog-title">Add A New Product</DialogTitle>
      <div style={{width: '80vw',padding:'0 5% 5%'}}>
        <TextField
          id="product-name"
          label="Name"
          style={{ margin: '8px 0' }}
          placeholder="Enter name of product"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          onChange={(e) => updateProductForm({...addProductForm, productName: e.target.value})}
        />
        <Autocomplete
          id="product-category"
          freeSolo
          options={props.returnProductCategories()}
          renderInput={params => (
            <TextField
              {...params}
              label="Category"
              margin="normal"
              variant="outlined"
              fullWidth
            />
          )}
          onChange={(e, value) => updateProductForm({...addProductForm, productCategory: value})}
        />
        <TextField
          id="outlined-full-width"
          label="Unit Price"
          style={{ margin: '10px 15px 10px 0' }}
          placeholder="Enter price in Naira"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          onChange={(e) => updateProductForm({...addProductForm, price: e.target.value})}
        />
        <TextField
          id="outlined-full-width"
          label="Unit Quantity"
          style={{ margin: '10px 10px 10px 0' }}
          placeholder="eg sachetes,cartons"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          onChange={(e) => updateProductForm({...addProductForm, minQuantity: e.target.value})}
        />
        <TextField
          id="outlined-full-width"
          label="Quantity"
          style={{ margin: '10px 0' }}
          placeholder="Enter quantity eg 100"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          variant="outlined"
          onChange={(e) => updateProductForm({...addProductForm, quantityLeft: e.target.value})}
        />
      </div>
      <div style={{display:'flex',justifyContent:'center',width:'100%'}}>
        <Button variant="contained" color="primary" onClick={() => onSubmitClick(addProductForm)}
        >Create</Button>
      </div>
    </div>
  );
}
