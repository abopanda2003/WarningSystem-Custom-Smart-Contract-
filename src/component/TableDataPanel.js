import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 'auto',
    backgroundColor: "#01071a",
  },
});

export default function TableDataPanel(props) {
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow >
            <TableCell align="center" style={{color:"white"}}>Item Name</TableCell>
            <TableCell align="center" style={{color:"white"}}>Quantity</TableCell>
            <TableCell align="center" style={{color:"white"}}>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data?.map((row) => (
            <TableRow key={row.key}>
              <TableCell align="center" component="th" scope="row" style={{color:"white"}}>
                {row.itemName}
              </TableCell>
              <TableCell align="center" style={{color:"white"}}>{row.itemQuantity}</TableCell>
              <TableCell align="center" style={{color:"white"}}>{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}