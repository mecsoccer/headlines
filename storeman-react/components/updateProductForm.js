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
  const classes = useStyles();
  const [product, addProductToState] = React.useState({});
  const [productShouldUpdate, updateProduct] = React.useState(false)

  React.useEffect(() => {
    const abortController = new AbortController();

    getSingleProduct();

    return () => abortController.abort();
  }, [productShouldUpdate]);
  
  axiosInstance.defaults.headers.common['Authorization'] = sessionStorage.getItem('storeToken');

  function getSingleProduct() {
    axiosInstance.get(`/products/${props.productId}`)
      .then((data) => {
        addProductToState(data.data.product)
      })
      .catch(err => console.log(err));
  }

  function onSubmitClick() {
    const {
      productname: productName,
      productcategory: productCategory,
      price,
      quantityleft: quantityLeft,
      minquantity: minQuantity,
      quantitysold: quantitySold,
    } = product;

    const productForm = { productName, productCategory, price, minQuantity, quantityLeft, quantitySold };

    axiosInstance.put(`/products/details/${props.productId}`, productForm)
      .then((data) => {
        props.initiateFetchProducts();
        props.closeDialog();
      })
      .catch(err => console.log(err));
  }

  return (
    <div className={classes.container} style={{padding:'0 5px 30px'}}>
      <DialogTitle id="form-dialog-title">Update Product</DialogTitle>
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
          value={product.productname}
          onChange={(e) => addProductToState({...product, productname: e.target.value})}
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
          value={`${product.productcategory}`}
          onChange={(e, value) => addProductToState({...product, productcategory: value})}
        />
        <TextField
          id="outlined-full-width"
          label="Unit Price"
          style={{ margin: '10px 15px 10px 0' }}
          placeholder="Unit price in Naira"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          value={product.price}
          onChange={(e) => addProductToState({...product, price: e.target.value})}
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
          value={product.minquantity}
          onChange={(e) => addProductToState({...product, minquantity: e.target.value})}
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
          value={product.quantityleft}
          onChange={(e) => addProductToState({...product, quantityleft: e.target.value})}
        />
      </div>
      <div style={{display:'flex',justifyContent:'center',width:'100%'}}>
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmitClick}
        >Update</Button>
      </div>
    </div>
  );
}

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
]
