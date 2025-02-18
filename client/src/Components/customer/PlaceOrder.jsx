import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Navigation from './Navigation';
import { Modal, Box, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import MyCurrencyFormatter from '../currency-formatter/currencyFormatter';

function PlaceOrder() {
    const location = useLocation();
    const navigate = useNavigate();
    const { address: initialAddress } = location.state;
    const { cartItemsLength, updateCartCount } = useContext(CartContext);

    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [address, setAddress] = useState(initialAddress);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchCartFromDB();
        }
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

    const fetchCartFromDB = async () => {
        try {
            fetchUserDetails();
            let token = localStorage.getItem("token");
            let decoded = jwtDecode(token);
            const response = await axios.get(`http://localhost:4000/api/fetchcart/${decoded.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data.cart);
            const total = response.data.cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
            setTotalAmount(total.toFixed(2));
        } catch (err) {
            console.error("Error fetching cart:", err);
            navigate("/addtocart");
        }
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveAddress = () => {
        setOpenModal(false);
    };

    const placeOrder = async (paymentType) => {
        try {
            let token = localStorage.getItem("token");
            let decoded = jwtDecode(token);
            let newAddress = address.houseNo + ", " + address.street1 + ", " + address.street2 + ", " + address.city + ", " + address.state + ", " + address.pincode;
            let user_id = decoded.id;
            const response = await axios.post("http://localhost:4000/api/placeorder", {
                userId: user_id,
                address: newAddress,
                payment_method: paymentType
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                updateCartCount(cartItemsLength - cartItems.length);
                toast.success("Order placed successfully");
                navigate('/');
                fetchCartFromDB();
                setAddress("");
            }
        }
        catch (err) {
            console.log(err.response);
            toast.error(err.response?.data?.message || "Failed to place order");
        }
    }

    return (
        <div className="bg-gray-800 lg:h-[100vw] md:h-[100vw]">
            <Navigation />
            <div className="w-full flex">
                <div className="w-full md:w-2/3 m-6 p-10 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-200">Your Items - ({cartItemsLength})</h2>
                    <div className="space-y-4">
                        {cartItems.length > 0 ? cartItems.map((item, index) => (
                            <div key={index} className="flex items-center bg-gray-500 justify-around p-4 border border-gray-300 rounded-md">
                                <img
                                    src={item.product.images[0].imageUrl}
                                    alt={item.imageUrl}
                                    className="w-16 object-cover mx-8 cursor-pointer rounded-md"
                                />
                                <div>
                                    <h3 className="font-semibold">{item.product.name}</h3>
                                    <p className="text-sm text-gray-200 font-bold">Price: {MyCurrencyFormatter(item.product.price)}</p>
                                    <p className="text-sm text-gray-200 font-bold">Quantity: {item.quantity}</p>
                                </div>
                                <p className="text-lg font-semibold">{MyCurrencyFormatter((item.product.price * item.quantity).toFixed(2))}</p>
                            </div>
                        )) : <p>No items in cart</p>}
                    </div>
                    <div className="mt-6 text-xl font-bold flex justify-end items-center">
                        <span className="text-green-700 bg-black border-2 rounded-3xl text-right px-4 py-2">Total: ₹ {totalAmount}</span>
                    </div>
                </div>

                {/* Address & Payment Section */}
                <div className="w-full md:w-1/3 mt-6 md:mt-0 md:ml-6 p-6 rounded-lg shadow-md">
                    <div className="mb-6 px-5 py-2">
                        <h2 className="text-xl text-center font-bold text-green-700 bg-black border-2 rounded-3xl px-4 py-2">Delivery Address</h2>
                        <p className="text-gray-200 mt-2 font-bold text-2xl">
                            {address.houseNo}, {address.street1}, {address.street2}, {address.city}, {address.state}, {address.pincode}
                        </p>
                        <button onClick={handleOpenModal} className="mt-2 text-blue-500 hover:underline">
                            Edit Address
                        </button>
                    </div>

                    <h2 className="text-xl text-center font-bold text-green-700 bg-black border-2 rounded-3xl px-4 py-2 mb-4">Choose Payment Method</h2>
                    <button onClick={() => placeOrder("cod")} className="lg:w-full my-2 cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center">
                        Cash on Delivery
                    </button>
                    <button onClick={() => placeOrder("online")} className="lg:w-full my-2 cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center">
                        Pay via UPI
                    </button>
                </div>
            </div>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: 400,
                    bgcolor: '#e5e7eb', boxShadow: 24, p: 4, borderRadius: 2
                }}>
                    <h2 className="text-xl font-bold mb-4">Edit Address</h2>
                    <TextField fullWidth margin="dense" sx={{
                        color: 'primary',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'lightgray' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    }} label="House No" name="houseNo" value={address.houseNo} onChange={handleAddressChange} />
                    <TextField fullWidth margin="dense" label="Street 1" name="street1" value={address.street1} onChange={handleAddressChange} />
                    <TextField fullWidth margin="dense" label="Street 2" name="street2" value={address.street2} onChange={handleAddressChange} />
                    <TextField fullWidth margin="dense" label="City" name="city" value={address.city} onChange={handleAddressChange} />
                    <TextField fullWidth margin="dense" label="State" name="state" value={address.state} onChange={handleAddressChange} />
                    <TextField fullWidth margin="dense" label="Pincode" name="pincode" value={address.pincode} onChange={handleAddressChange} />

                    <div className="flex justify-between flex-row items-center mt-4">
                        <Button onClick={handleCloseModal} variant="contained" color="error">Cancel</Button>
                        <Button onClick={handleSaveAddress} variant="contained" color="primary">Save</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default PlaceOrder;
