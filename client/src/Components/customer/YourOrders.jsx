import 'react';
import Navigation from './Navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import moment from 'moment';
import { toast } from 'react-toastify';
import MyCurrencyFormatter from '../currency-formatter/currencyFormatter';

function YourOrders() {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem("token");
    let decoded = jwtDecode(token);
    let firstName = decoded.name.split(" ")[0];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchUserDetails = async (token) => {
        if (!token) return;

        try {
            const response = await axios.get('http://localhost:4000/api/getuserdetails', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const expiryTime = response.data.userDetails.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime < expiryTime) {
                toast.error("Client : Session expired");
            }
        } catch (error) {
            toast.error(error.response.data.error);
            console.error('Error fetching user details:', error);
            return null;
        }
    };

    const fetchOrders = async () => {
        try {
            fetchUserDetails();
            let token = localStorage.getItem("token");
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            const response = await axios.get('http://localhost:4000/api/getorders', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data.orders.filter((order) => order.userId === userId));
            console.log(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div className='bg-gray-800 min-h-screen'>
            <Navigation />
            <div className="w-full flex flex-col items-center mt-10 justify-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-200"> {firstName.toUpperCase() + "'s orders"} - ({orders.length})</h2>
                <div className="w-full md:w-2/3 m-6 px-10 rounded-lg shadow-md">
                    <div className="space-y-6">
                        {orders.length > 0 ? orders.map((order, orderIndex) => (
                            <div key={orderIndex} className="bg-gray-900 px-6 py-6 rounded-lg shadow-md">
                                <p className='text-xl font-bold text-blue-200 text-center mb-2'>{moment(order.createdAt).format('DD/MM/YYYY - hh:mm A')} </p>
                                <h3 className="text-lg text-center font-bold text-gray-200 mb-2">
                                    <span className="text-blue-500">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                </h3>
                                {order.orderItems.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center justify-between bg-gray-900 p-4 border border-gray-300 rounded-md mb-2">
                                        <img
                                            src={item.product.images?.[0]?.imageUrl || 'https://via.placeholder.com/80'}
                                            alt={item.product.name}
                                            className="w-16 object-cover rounded-md"
                                        />
                                        <div className="flex-1 px-4">
                                            <h3 className="font-semibold text-white">{item.product.name}</h3>
                                            <p className="text-sm text-gray-300">Price: {MyCurrencyFormatter(item.price)}</p>
                                            <p className="text-sm text-gray-300">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="text-lg font-semibold text-white">{MyCurrencyFormatter((item.price * item.quantity).toFixed(2))}</p>
                                    </div>
                                ))}
                                <div className="mt-3 text-2xl font-bold text-right text-green-500">
                                    Total: {MyCurrencyFormatter(order.totalAmount)}
                                </div>
                            </div>
                        )) : <p className="text-white">No orders found</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default YourOrders;
