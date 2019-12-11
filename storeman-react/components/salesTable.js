import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'name', label: 'Product', align:'center', minWidth: 170 },
  { id: 'code', label: 'Seller', align:'center', minWidth: 170 },
  {
    id: 'population',
    label: 'Date',
    minWidth: 170,
    align: 'center',
    format: value => value.toLocaleString(),
  },
  {
    id: 'size',
    label: 'Qty sold',
    minWidth: 170,
    align: 'center',
    format: value => value.toLocaleString(),
  },
  {
    id: 'price',
    label: 'Total Price',
    minWidth: 170,
    align: 'center',
    format: value => value.toLocaleString(),
  },
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

  const users = [...props.users];

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
          {props.sales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sale) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={sale.id}>
                  <TableCell align="center" key={1/*product.productname*/}>
                    {sale.productname}
                  </TableCell>
                  <TableCell align="center" key={2/*product.productname*/}>
                    {{...(users.find(user => user.id == sale.seller))}.username}
                  </TableCell>
                  <TableCell align="center" key={3/*product.productname*/}>
                    {`
                      ${(new Date(sale.date)).getDate()}/${(new Date(sale.date)).getMonth()}/${(new Date(sale.date)).getYear() + 1900}
                    `}
                  </TableCell>
                  <TableCell align="center" key={4/*product.productname*/}>
                    {sale.quantity}
                  </TableCell>
                  <TableCell key={5} align="center">
                    {sale.totalprice}
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
        count={props.sales.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
