import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
//import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TablePagination from '@mui/material/TablePagination';
import { useTheme } from '../../context/themeContext';

function createData(
  orderId: string,
  paymentId: string,
  name: string,
  phoneNumber: number,
  address: string,
  pincode: string,
  totalAmount: number,
  email: string,
  userId: string,
  orderStatus: string,
  date: string
) {
  return {
    orderId,
    paymentId,
    name,
    phoneNumber,
    address,
    pincode,
    totalAmount,
    email,
    userId,
    orderStatus,
    date,
    history: [
      {
        productId: '2020-01-05',
        productTitle: '11091700',
        image: "https://th.bing.com/th/id/OIP.Qtd1vbWR1O9mFYIIcGmdTwHaHa?w=151&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        quantity: 3,

      },
      {
        productId: '2020-01-02',
        productTitle: 'Anonymous',
        image: "https://th.bing.com/th/id/OIP.Qtd1vbWR1O9mFYIIcGmdTwHaHa?w=151&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        quantity: 1,

      },
    ],
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const getStatusColor = (status) => {
    const classes = {
      Shipped: 'bg-blue-100 text-blue-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      Delivered: 'bg-green-100 text-green-700',
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  };


  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} className=" dark:bg-gray-800">
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon className='dark:text-white' /> : <KeyboardArrowDownIcon className='dark:text-white' />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" className='text-nowrap dark:text-white'>{row.orderId}</TableCell>
        <TableCell align="right" className='text-nowrap dark:text-white'>{row.paymentId}</TableCell>
        <TableCell align="right" className='text-nowrap dark:text-white'>{row.name}</TableCell>
        <TableCell align="right" className='text-nowrap dark:text-white'>{row.phoneNumber}</TableCell>
        <TableCell align="left" style={{ minWidth: 300 }} className='dark:text-white'>{row.address}</TableCell>
        <TableCell align="right" className='text-nowrap dark:text-white'>{row.pincode}</TableCell>
        <TableCell align="center" className='text-nowrap dark:text-white'>{row.totalAmount}</TableCell>
        <TableCell align="right" className='text-nowrap dark:text-white'>{row.email}</TableCell>
        <TableCell align="right" className='text-nowrap dark:text-white'>{row.userId}</TableCell>
        <TableCell align="right"><span className={`text-nowrap py-2 px-4 text-sm rounded-full ${getStatusColor(row.orderStatus)}`}>{row.orderStatus}</span></TableCell>
        <TableCell align="right" className='text-nowrap dark:text-white'>{row.date}</TableCell>
      </TableRow>
      <TableRow className='dark:bg-gray-800'>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 80, borderBottom: "none" }} colSpan={6} >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {/* <Typography variant="h6" gutterBottom component="div">
                History
              </Typography> */}
              <Table size="small" aria-label="purchases" >
                <TableHead>
                  <TableRow className='dark:bg-gray-800'>
                    <TableCell className='dark:text-white'>PRODUCT ID</TableCell>
                    <TableCell className='dark:text-white'>PRODUCT TITLE</TableCell>
                    <TableCell className='dark:text-white' align="left">IMAGE</TableCell>
                    <TableCell className='dark:text-white' align="right">QUANTITY</TableCell>
                    <TableCell className='dark:text-white' align="right">TOTAL PRICE ($)</TableCell>
                    <TableCell className='dark:text-white' align="right">SUB TOTAL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.productId} className='dark:bg-gray-800'>
                      <TableCell component="th" scope="row" className='dark:text-white'>{historyRow.productId}</TableCell>
                      <TableCell className='dark:text-white'>{historyRow.productTitle}</TableCell>
                      <TableCell className='dark:text-white'><img src={historyRow.image} className='h-12 w-12 rounded-md object-cover' /></TableCell>
                      <TableCell align="right" className='dark:text-white'>{historyRow.quantity}</TableCell>
                      <TableCell align="right" className='dark:text-white'>
                        {Math.round(historyRow.quantity * row.totalAmount * 100) / 100}
                      </TableCell>
                      <TableCell align="right" className='dark:text-white'>
                        {Math.round(historyRow.quantity * row.totalAmount * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
const rows = [
  createData('ORD12345', "pay_001", "GOVARDHAN REDDY", 9876543210, "H.No 222, Street No.4, Pragathi Colony, Hyderabad", "500073", 5800, "johndoe@GoMail.com", "USER001", "Pending", "2-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Shipped", "3-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Delivered", "3-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Delivered", "3-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Shipped", "3-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Pending", "3-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Delivered", "3-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Pending", "3-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Delivered", "3-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Pending", "3-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Shipped", "3-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Shipped", "3-1-2025"),
  createData('ORD12346', "pay_002", "RAHUL KUMAR", 9123456789, "123, Banjara Hills, Hyderabad", "500034", 7200, "rahul@GoMail.com", "USER002", "Delivered", "3-1-2025"),
];

export default function MuiCollapsibleTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

   


  return (
    <div>
    <h2 className='text-xl font-semibold dark:text-white text-gray-800 p-4 pl-10'>Recent Orders</h2>
    <Paper className='bg-gray-50 dark:bg-gray-900 text-[#fff] dark:text-[#000] w-[95%] mx-auto'>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }} className='dark:bg-gray-800 muiTableContainer overflow-auto'>
        <Table aria-label="collapsible table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className='dark:bg-gray-900' />
              <TableCell align="center" className='text-nowrap dark:text-white dark:bg-gray-900'>ORDER ID</TableCell>
              <TableCell align="center" className='text-nowrap dark:text-white dark:bg-gray-900'>PAYMENT ID</TableCell>
              <TableCell align="center" className='text-nowrap dark:text-white dark:bg-gray-900'>NAME</TableCell>
              <TableCell align="center" className='text-nowrap dark:text-white dark:bg-gray-900'>PHONE NUMBER</TableCell>
              <TableCell align="center" style={{ minWidth: 300 }} className='dark:text-white dark:bg-gray-900'>ADDRESS</TableCell>
              <TableCell align="center" className='text-nowrap dark:text-white dark:bg-gray-900'>PINCODE</TableCell>
              <TableCell align="center" className='text-nowrap dark:text-white dark:bg-gray-900'>TOTAL AMOUNT</TableCell>
              <TableCell align="center" className='text-nowrap dark:text-white dark:bg-gray-900'>EMAIL</TableCell>
              <TableCell align="center" className='text-nowrap dark:text-white dark:bg-gray-900'>USER ID</TableCell>
              <TableCell align="center" className='text-nowrap dark:text-white dark:bg-gray-900'>ORDER STATUS</TableCell>
              <TableCell align="center" className='text-nowrap dark:text-white dark:bg-gray-900'>DATE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className='dark:bg-gray-800'>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[3, 5, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className=' dark:bg-gray-900 dark:text-white'
      />
    </Paper>
    </div>
  );
}
