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

function createData(name, code, population, size, price) {
  return { name, code, population, size, price };
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263, 2500),
  createData('China', 'CN', 1403500365, 9596961, 2500),
  createData('Italy', 'IT', 60483973, 301340, 2500),
  createData('United States', 'US', 327167434, 9833520, 2500),
  createData('Canada', 'CA', 37602103, 9984670, 2500),
  createData('Australia', 'AU', 25475400, 7692024, 2500),
  createData('Germany', 'DE', 83019200, 357578, 2500),
  createData('Ireland', 'IE', 4857000, 70273, 2500),
  createData('Mexico', 'MX', 126577691, 1972550, 2500),
  createData('Japan', 'JP', 126317000, 377973, 2500),
  createData('France', 'FR', 67022000, 640679, 2500),
  createData('United Kingdom', 'GB', 67545757, 242495, 2500),
  createData('Russia', 'RU', 146793744, 17098246, 2500),
  createData('Nigeria', 'NG', 200962417, 923768, 2500),
  createData('Brazil', 'BR', 210147125, 8515767, 2500),
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
          {props.sales.map((sale) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={sale.id}>
                  <TableCell align="center" key={1/*product.productname*/}>
                    {sale.productname}
                  </TableCell>
                  <TableCell align="center" key={2/*product.productname*/}>
                    {sale.seller}
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
                    {sale.total}
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column, idx) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
