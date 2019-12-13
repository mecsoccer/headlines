import React from 'react';
import axiosInstance from '../apis/storemanager';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const CartView = (props) => {
  const classes = useStyles();

  function createSaleOrder() {
    if (!props.cartProducts.length) return;
    const productsToSale = props.cartProducts.map((prod) => {
      const {
        id: productId,
        productname: productName,
        price: unitPrice,
        totalprice: totalPrice,
        quantity,
      } = prod;
      
      return {
        seller: sessionStorage.getItem('storeUserId'), productId, productName, quantity, unitPrice, totalPrice }
    });

    axiosInstance.defaults.headers.common['Authorization'] = sessionStorage.getItem('storeToken');
    axiosInstance.post('/sales', { sales: productsToSale })
      .then((data) => {
        alert('sale order successful');
        props.closeDialog();
        props.initiateFetchProducts(!props.fetchProd);
        props.setCartProducts([]);
      })
      .catch(err => console.log(err));
  }

  return (
    <>
      <DialogTitle id="form-dialog-title">Overview of Cart Content</DialogTitle>
      <List style={{...props.customStyle, width: 600}} className={classes.root}>
        {
          props.cartProducts
            .filter((prod) => prod.productname.includes(props.searchInput ? props.searchInput : ''))
            .map(value => {
              const labelId = `checkbox-list-label-${value.id}`;
              return (
                <ListItem key={value.id} role={undefined} divider button dense onClick={props.addProductToCart(value.id)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={props.cartProducts.find(prod => prod.id === value.id) ? true : false}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                      onClick={props.removeProductFromCart(value.id)}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.productname} />
                  <ListItemSecondaryAction>
                    <span style={{marginRight:100}}>&#8358;{value.price}</span>
                    <input
                      style={{width: 50}}
                      value={{...props.cartProducts.find(prod => prod.id === value.id)}.quantity}
                    />
                    <IconButton
                      edge="end" aria-label="comments" key={1} onClick={() => props.incrementProduct(value.id, 1)}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="comments" key={2} onClick={() => props.decrementProduct(value.id, 1)}>
                      <RemoveIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
          })
        }
      </List>
      <div style={{display:'flex',justifyContent:'center',margin:'40px 0'}}>
        <Button
          variant="contained"
          color="primary"
          style={{width:'60%'}}
          onClick={() => createSaleOrder()}
        >
          create sale order
        </Button>
      </div>
    </>  
  );
}

export default CartView;
