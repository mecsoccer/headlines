import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Checklist from './checklist';

const Custom = (props) => {
    const defaultProps = {
        options: top100Films,
        getOptionLabel: option => option.title,
    };
    
    const flatProps = {
        options: top100Films.map(option => option.title),
    };
    
    const [value, setValue] = React.useState(null);

    return (
        <main style={{width: '100%', marginTop: 60}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <ShoppingCartIcon style={{color: 'green', height: 100, width: 100}}/>
                <span style={{fontSize: 30}}>
                    <Typography variant="h3">
                        &#x20A6;2000
                    </Typography>
                </span>
            </div>
            <div style={{maxWidth: 1000, margin: 'auto'}}>
                <div style={{display: 'flex'}}>
                    <Autocomplete
                        id="grouped-demo"
                        options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                        groupBy={option => option.firstLetter}
                        getOptionLabel={option => option.title}
                        style={{ width: 300, height: 'fit-content' }}
                        renderInput={params => (
                            <TextField {...params} label="With categories" variant="outlined" fullWidth />
                        )}
                    />
                </div>
                <Checklist />
                <div style={{display:'flex',flexDirection:'row-reverse',marginTop:20}}>
                    <Button variant="contained" color="primary">Checkout</Button>
                </div>
            </div>
        </main>
    );
}

export default Custom;

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

const options = top100Films.map(option => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });