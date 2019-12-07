import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Form from './updateProductForm';
import DeleteDialog from './deleteDialog';

const columns = [
  { id: 'name', label: 'Product', align:'center', minWidth: 170 },
  { id: 'code', label: 'Category', align:'center', minWidth: 100 },
  {
    id: 'population',
    label: 'Price',
    minWidth: 170,
    align: 'center',
    format: value => value.toLocaleString(),
  },
  {
    id: 'size',
    label: 'Quantity',
    minWidth: 170,
    align: 'center',
    format: value => value.toLocaleString(),
  },
  {
    id: 'density',
    label: 'Operations',
    minWidth: 170,
    align: 'center',
    format: value => value.toFixed(2),
  },
];

function createData(name, code, population, size) {
  return { name, code, population, size };
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263),
  createData('China', 'CN', 1403500365, 9596961),
  createData('Italy', 'IT', 60483973, 301340),
  createData('United States', 'US', 327167434, 9833520),
  createData('Canada', 'CA', 37602103, 9984670),
  createData('Australia', 'AU', 25475400, 7692024),
  createData('Germany', 'DE', 83019200, 357578),
  createData('Ireland', 'IE', 4857000, 70273),
  createData('Mexico', 'MX', 126577691, 1972550),
  createData('Japan', 'JP', 126317000, 377973),
  createData('France', 'FR', 67022000, 640679),
  createData('United Kingdom', 'GB', 67545757, 242495),
  createData('Russia', 'RU', 146793744, 17098246),
  createData('Nigeria', 'NG', 200962417, 923768),
  createData('Brazil', 'BR', 210147125, 8515767),
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
});

export default function StickyHeadTable(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const formProps = {
    closeDialog: props.closeDialog,
    initiateFetchProducts: props.initiateFetchProducts,
    returnProductCategories: props.returnProductCategories,
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={product.id}>
                  <TableCell align="center" key={1/*product.productname*/}>
                    {product.productname}
                  </TableCell>
                  <TableCell align="center" key={2/*product.productname*/}>
                    {product.productcategory}
                  </TableCell>
                  <TableCell align="center" key={3/*product.productname*/}>
                    {product.price}
                  </TableCell>
                  <TableCell align="center" key={4/*product.productname*/}>
                    {product.quantityleft}
                  </TableCell>
                  <TableCell key={5} align="center">
                      <EditIcon
                        style={{marginRight: 10, color: 'blue', cursor: 'pointer'}}
                        onClick={() => props.openDialog(<Form productId={product.id} {...formProps} />)}
                      />
                      <DeleteIcon
                        style={{color: 'red', cursor: 'pointer'}}
                        onClick={() => props.openDialog(<DeleteDialog productId={product.id} {...formProps} />)}
                      />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
