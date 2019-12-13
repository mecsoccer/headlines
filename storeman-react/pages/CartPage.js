import React, { useState, useEffect } from 'react';
import axiosInstance from '../apis/storemanager';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Checklist from '../components/checklist';
import Layout from '../components/layout';
import Dialog from '../components/dialog';
import CartView from '../components/cartView';

const CartPage = () => {
  const [dialogOpen, toggleDialog] = useState(false);

  const [availableProducts, saveAvailableProducts] = React.useState([]);
  const [products, updateProducts] = React.useState([]);
  const [fetchProd, initiateFetchProducts] = React.useState(false);

  const [cartProducts, setCartProducts] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState('');

  useEffect(() => {
      fetchAvailableProducts();
  }, [fetchProd]);

  function closeDialog() {
      toggleDialog(false);
  }

  function fetchAvailableProducts() {
    axiosInstance.defaults.headers.common['Authorization'] = sessionStorage.getItem('storeToken');
    axiosInstance.get('/products/available')
      .then((data) => {
        saveAvailableProducts(data.data.availableProducts);
        updateProducts(data.data.availableProducts);
      })
      .catch(err => console.log(err));
  }

  function returnProductCategories() {
    return (
      availableProducts
        .map(prod => prod.productcategory)
        .filter((category, idx, arr) => arr.indexOf(category) === idx)
        .sort()
    );
  }

  function productsByCategory(category) {
    if (category === null) {
      updateProducts(availableProducts);
      return;
    }

    const filteredProducts = availableProducts.filter((prod) => prod.productcategory === category);
    
    updateProducts(filteredProducts);
  }

  const addProductToCart = id => () => {
    const inCart = cartProducts.find(prod => prod.id === id);

    if (inCart) return;
    
    const index = cartProducts.length;
    const { id: productId, price, productname, quantityleft } = products.find(prod => prod.id === id);
    const totalprice = price;

    setCartProducts([
      ...cartProducts,
      { id: productId, productname, price, totalprice, quantity: 1, quantityleft, index }
    ]);
  };

  const removeProductFromCart = id => () => {
    const inCart = cartProducts.find(prod => prod.id === id);
    const newCart = [...cartProducts];

    if (inCart) newCart.splice(newCart.indexOf(inCart), 1);
    
    setCartProducts(newCart);
  };

  const incrementProduct = (id, qty) => {
    const newCartProducts = [...cartProducts]
    const inCart = newCartProducts.find(prod => prod.id === id);

    if (!inCart || inCart.quantity + qty > inCart.quantityleft) return;

    inCart.quantity += Math.floor(qty);
    inCart.totalprice = inCart.price * inCart.quantity;
    newCartProducts[inCart.index] = inCart;

    return setCartProducts(newCartProducts);
  };

  const decrementProduct = (id, qty) => {
    const newCartProducts = [...cartProducts]
    const inCart = newCartProducts.find(prod => prod.id === id);

    if (!inCart || inCart.quantity - qty < 0) return;

    inCart.quantity -= Math.floor(qty);
    inCart.totalprice = inCart.price * inCart.quantity;
    newCartProducts[inCart.index] = inCart;

    return setCartProducts(newCartProducts);
  };

  const showTotalPrice = () => {
    return cartProducts.map(prod => prod.price * prod.quantity).reduce((a, b) => a + b, 0);
  }

  const showTotalItems = () => {
    return cartProducts.map(prod => prod.quantity).reduce((a, b) => a + b, 0);
  }

  const cartProductProps = {
    products,
    cartProducts,
    setCartProducts,
    searchInput,
    setSearchInput,
    addProductToCart,
    removeProductFromCart,
    incrementProduct,
    decrementProduct,
    closeDialog,
    fetchProd,
    initiateFetchProducts,
    customStyle: {height:'70vh',overflowY: 'scroll',padding:'0 20px'}
  };

  return (
    <Layout currentTab={'Cart'}>
      {dialogOpen ? <Dialog closeDialog={closeDialog}><CartView {...cartProductProps}/></Dialog> : null}
      <main style={{width: '100%', marginTop: 100}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{position:'relative',cursor:'pointer'}}>
            <div
              style={{width:25,height:25,zIndex:2,left:'40%',top:10,display:'flex',
                textAlign:'center',borderRadius:15,alignItems:'center',justifyContent:'center',
                background:'red',color:'white',position:'absolute'}}
            >
              {showTotalItems()}
            </div>
            <ShoppingCartIcon
              style={{color: 'green', height: 100, width: 100,position:'relative'}}
              onClick={() => toggleDialog(true)}
            />
          </div>
          <span style={{fontSize: 30}}>
            <Typography variant="h3">
                &#x20A6;{showTotalPrice().toLocaleString()}.00
            </Typography>
          </span>
        </div>
        <div style={{maxWidth: 800, margin: 'auto'}}>
          <div style={{display: 'flex',marginBottom:10}}>
            <Autocomplete
              id="grouped-demo"
              options={returnProductCategories()}
              style={{ width: 300, height: 'fit-content' }}
              renderInput={params => (
                <TextField {...params} label="With categories" variant="outlined" fullWidth />
              )}
              onInput={(e, value) => productsByCategory(value)}
            />
          </div>
          <Checklist {...cartProductProps}/>
          <div style={{display:'flex',flexDirection:'row-reverse',marginTop:20,marginBottom:50}}>
            <Button variant="contained" color="primary"
              onClick={() => toggleDialog(true)}
            >View Cart</Button>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default CartPage;
