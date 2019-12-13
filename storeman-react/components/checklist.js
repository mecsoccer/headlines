import React from 'react';
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
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CheckboxList(props) {
  const classes = useStyles();

  return (
    <List style={props.customStyle} className={classes.root}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        options={props.products.map(option => option.productname)}
        renderInput={params => (
          <TextField
            {...params}
            label="Search Products"
            margin="normal"
            variant="outlined"
            fullWidth
            InputProps={{ ...params.InputProps, type: 'search' }}
          />
        )}
        onInput={(e, inputValue) => props.setSearchInput(inputValue)}
      />
      {
        props.products
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
                  <span style={{marginRight:100}}>&#8358;{{...props.cartProducts.find(prod => prod.id === value.id)}.totalprice}</span>
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
  );
}
