import React from 'react';
import axiosInstance from '../apis/storemanager';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Layout from '../components/layout';
import SalesTable from '../components/salesTable';

import 'date-fns';
import DatePicker from '../components/datePicker';

function SalesPage() {
    return (
        <Layout currentTab={'Sales'}>
            <SalesRecord />
        </Layout>
    );
}

export default SalesPage;

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

const SalesRecord = () => {
    const classes = useStyles();

    const initialQueryState = { seller: '', productId: '' };

    const [sales, updateSales] = React.useState([]);
    const [fetchSales, initiateFetchSales] = React.useState(false);

    const [users, setUsers] = React.useState([]);
    //const [fetchUsers, initiateFetchUsers] = React.useState(false);

    const [products, setProducts] = React.useState([]);
    const [fetchProducts, initiateFetchProducts] = React.useState(false);

    const [dateFrom, setDateFrom] = React.useState('2019-09-14');
    const [dateTo, setDateTo] = React.useState((new Date()).toISOString().slice(0, 10));

    const [query, setQuery] = React.useState({...initialQueryState, from: dateFrom, to: dateTo});

    React.useEffect(() => {
      fetchSalesRecord();
      fetchAllUsers();
      fetchAllProducts();
    }, [fetchSales]);

    const sellerProps = {
        options: users.filter((user, idx, arr) => arr.indexOf(user) === idx),
        getOptionLabel: option => option.username,
    };

    const productsProps = {
      options: products.filter((prod, idx, arr) => arr.indexOf(prod) === idx),
      getOptionLabel: option => option.productname,
    };

    function fetchSalesRecord() {
      const { seller, productId, from, to } = query;

      axiosInstance.defaults.headers.common['Authorization'] = sessionStorage.getItem('storeToken');
      axiosInstance.get(`/sales?seller=${seller}&productId=${productId}&from=${from}&to=${to}`)
        .then((data) => {
          updateSales(data.data.allSales);
        })
        .catch(err => console.log(err));
    }

    function fetchAllUsers() {
      axiosInstance.defaults.headers.common['Authorization'] = sessionStorage.getItem('storeToken');
      axiosInstance.get('/users')
        .then((data) => {
          setUsers(data.data.allUsers);
        })
        .catch(err => console.log(err));
    }

    function fetchAllProducts() {
      axiosInstance.defaults.headers.common['Authorization'] = sessionStorage.getItem('storeToken');
      axiosInstance.get('/products')
        .then((data) => {
          setProducts(data.data.allProducts);
        })
        .catch(err => console.log(err));
    }

    const salesTableProps = { sales, users };
    
    return (
        <main style={{width: '100%', marginTop: 100,marginBottom:50}}>
          <div style={{maxWidth: 1000, margin: 'auto'}}>
            <div style={{display: 'flex',justifyContent:'space-between', marginBottom: 50}}>
              <div style={{display:'flex'}}>
                <Autocomplete
                  style={{width:200, marginRight:20}}
                  {...sellerProps}
                  id="controlled-demo"
                  onChange={(event, newValue) => {
                    setQuery({...query, seller: newValue ? newValue.id : ''});
                    initiateFetchSales(!fetchSales);
                  }}
                  renderInput={params => (
                    <TextField {...params} label="choose seller" margin="normal" fullWidth />
                  )}
                />
                <Autocomplete
                  style={{width:200,marginRight:20}}
                  {...productsProps}
                  id="controlled-demo"
                  onChange={(event, newValue) => {
                    setQuery({...query, productId: newValue ? newValue.id : ''});
                    initiateFetchSales(!fetchSales);
                  }}
                  renderInput={params => (
                    <TextField {...params} label="choose product" margin="normal" fullWidth />
                  )}
                />
              </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'flex-end',marginRight:10}}>
                    <span style={{marginRight:5}}>From:</span>
                    <DatePicker date={dateFrom} setDateFrom={setDateFrom} />
                  </div>
                  <div style={{display:'flex',alignItems:'flex-end'}}>
                    <span style={{marginRight:5}}>To:</span>
                    <DatePicker date={dateTo} setDateTo={setDateTo} />
                  </div>
                </div>
            </div>
            <div style={{marginBottom: 20}}>
              <SalesTable {...salesTableProps} customStyle={{}}/>
            </div>
            <Button variant="outlined" color="primary" style={{float: 'right'}}>
              export
            </Button>
          </div>
        </main>
    );
}
