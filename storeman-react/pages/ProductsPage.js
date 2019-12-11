import React, { useState } from 'react';
import axiosInstance from '../apis/storemanager';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Layout from '../components/layout';
import ProductsTable from '../components/productsTable';
import Dialog from '../components/dialog';
import Form from '../components/createProductForm';

function ProductsPage() {
    return (
        <Layout currentTab={'Products'}>
            <ProductsShelve />
        </Layout>
    );
}

export default ProductsPage;

const useStyles = makeStyles(theme => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
}));

const ProductsShelve = () => {
    const [dialogOpen, toggleDialog] = useState(false);
    const [dialogContent, changeDialogContent] = useState(null);

    const [categoryShowing, updateCategoryShowing] = React.useState(null);
    const [stockLevel, toggleStockLevel] = React.useState(null);
    const [allProducts, saveAllProducts] = React.useState([]);
    const [products, updateProducts] = React.useState([]);
    const [fetchProd, initiateFetchProducts] = React.useState(false);

    const classes = useStyles();

    React.useEffect(() => {
        fetchProducts();
    }, [fetchProd]);

    function closeDialog() {
        toggleDialog(false);
    }

    function openDialog(form) {
        changeDialogContent(form);
        toggleDialog(true);
    }

    function fetchProducts() {
      axiosInstance.defaults.headers.common['Authorization'] = sessionStorage.getItem('storeToken');
      axiosInstance.get('/products')
        .then((data) => {
          saveAllProducts(data.data.allProducts);
          updateProducts(data.data.allProducts);
        })
        .catch(err => console.log(err));
    }

    function returnProductCategories() {
      return (
        allProducts
          .map(prod => prod.productcategory)
          .filter((category, idx, arr) => arr.indexOf(category) === idx)
          .sort()
      );
    }

    function productsByCategory(category, stock) {
      const cat = category === null ? '' : category;

      if (category === null && stock === null) {
        updateProducts(allProducts);
        return;
      }

      const filteredProducts = allProducts.filter((prod) => {
        if (stock === 'out of stock') {
          return prod.productcategory.includes(cat) && prod.quantityleft <= 0;
        }
        if (stock === 'instock') return prod.productcategory.includes(cat) && prod.quantityleft > 0;

        return prod.productcategory.includes(cat);
      });
      
      updateProducts(filteredProducts);
      updateCategoryShowing(category);
      toggleStockLevel(stock);
    }

    const formProps = { closeDialog, initiateFetchProducts, returnProductCategories };
    
    return (
      <>
        {dialogOpen ? <Dialog closeDialog={closeDialog} content={dialogContent}/> : null}
        <main style={{width: '100%', marginTop: 100}}>
          <div style={{maxWidth: 1000, margin: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 50}}>
              <div style={{display:'flex',alignItems:'flex-end'}}>
                <Autocomplete
                  id="grouped-demo"
                  options={returnProductCategories()}
                  style={{ width: 300 }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Select category"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                  onChange={(e, value) => productsByCategory(value, stockLevel)}
                />
                <Autocomplete
                  style={{width:200,marginLeft:20}}
                  options={['instock', 'out of stock']}
                  id="controlled-demo"
                  renderInput={params => (
                    <TextField {...params} label="stock level" margin="normal" fullWidth />
                  )}
                  onChange={(e, value) => productsByCategory(categoryShowing, value)}
                />
              </div>
              <div className={classes.root}>
                <Fab color="primary" aria-label="add" onClick={() => openDialog(<Form {...formProps} />)}>
                  <AddIcon />
                </Fab>
              </div>
            </div>
            <div style={{marginBottom: 50}}>
              <ProductsTable
                products={products}
                openDialog={openDialog}
                closeDialog={closeDialog}
                initiateFetchProducts={initiateFetchProducts}
                returnProductCategories={returnProductCategories}
              />
            </div>
          </div>
        </main>
      </>
    );
}
