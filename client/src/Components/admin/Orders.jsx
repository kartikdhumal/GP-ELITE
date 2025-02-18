import 'react';
import AdminNavbar from './AdminNavbar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, styled, TablePagination, TableFooter } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MyCurrencyFormatter from '../currency-formatter/currencyFormatter';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child TableCell, &:last-child th': {
            border: 0,
        },
    }));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/getproducts');
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            let token = localStorage.getItem("token");
            const response = await axios.get('http://localhost:4000/api/getorders', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data.orders);
            console.log(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };


    const handleStatusChange = async (id, newStatus) => {
        try {
            let token = localStorage.getItem("token");
            await axios.put(`http://localhost:4000/api/changestatus/${id}`, { status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === id ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };


    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/getusers');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchProducts();
        fetchUsers();
    }, []);

    return (
        <div className='bg-gray-800 min-h-screen'>
            <AdminNavbar />
            <div className="max-w-5xl mx-auto mt-8 p-6 bg-[#101828] rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-white">Orders List</h2>
                <TableContainer component={Paper} sx={{ bgcolor: '#101828' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>Date</TableCell>
                                <TableCell sx={{ color: 'white' }}>User Name</TableCell>
                                <TableCell sx={{ color: 'white' }}>Products</TableCell>
                                <TableCell sx={{ color: 'white' }}>Total Price</TableCell>
                                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ color: 'gray' }}>No orders available.</TableCell>
                                </TableRow>
                            ) : (
                                (rowsPerPage > 0
                                    ? orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : orders
                                ).map((order, index) => {
                                    const user = users.find(u => u.id === order.userId);

                                    return (
                                        <StyledTableRow key={index}>
                                            <TableCell sx={{ color: 'white' }}>
                                                {new Date(order.createdAt).toLocaleString('en-IN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                    timeZone: 'Asia/Kolkata'
                                                })}
                                            </TableCell>

                                            <TableCell sx={{ color: 'white' }}>{user ? user.name : "Unknown"}</TableCell>
                                            <TableCell sx={{ color: 'white' }}>
                                                <table className="w-full border-collapse">
                                                    <tbody>
                                                        {order.orderItems.map((item) => {
                                                            const product = products.find(p => p.id === item.productId);
                                                            return (
                                                                <tr key={item.id} className="border-b border-gray-700">
                                                                    <td className="p-2">
                                                                        {product && product.images.length > 0 && (
                                                                            <img
                                                                                src={product.images[0].imageUrl}
                                                                                alt={product.name}
                                                                                width="50"
                                                                                height="50"
                                                                                className="rounded"
                                                                            />
                                                                        )}
                                                                    </td>
                                                                    <td className="p-2">{product ? product.name : "Product Not Found"}</td>
                                                                    <td className="p-2">{item.quantity}</td>
                                                                    <td className="p-2">{MyCurrencyFormatter(item.price)}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </TableCell>

                                            <TableCell className='w-26' sx={{ color: 'white' }}>₹ {order.totalAmount}</TableCell>
                                            <TableCell sx={{ color: 'white', width: "100px" }}>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300
        ${order.status === "Pending" ? "bg-yellow-500 text-black border-yellow-600" :
                                                            order.status === "Processing" ? "bg-blue-500 text-white border-blue-600" :
                                                                order.status === "Shipped" ? "bg-purple-500 text-white border-purple-600" :
                                                                    order.status === "Delivered" ? "bg-green-500 text-white border-green-600" :
                                                                        order.status === "Cancelled" ? "bg-red-500 text-white border-red-600" :
                                                                            "bg-gray-800 text-white border-gray-500"}`}
                                                >
                                                    <option value={order.status} selected disabled>{order.status}</option>
                                                    <option value="Pending" className="bg-yellow-500 text-black">Pending</option>
                                                    <option value="Processing" className="bg-blue-500 text-white">Processing</option>
                                                    <option value="Shipped" className="bg-purple-500 text-white">Shipped</option>
                                                    <option value="Delivered" className="bg-green-500 text-white">Delivered</option>
                                                    <option value="Cancelled" className="bg-red-500 text-white">Cancelled</option>
                                                </select>


                                            </TableCell>
                                        </StyledTableRow>
                                    );
                                })
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[1, 5, 10, 15, { label: 'All', value: -1 }]}
                                    colSpan={5}
                                    sx={{
                                        color: "white"
                                    }}
                                    count={orders.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'rows per page' },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default Orders;
