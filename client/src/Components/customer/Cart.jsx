import { useState, useEffect, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Navigation from './Navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MyCurrencyFormatter from '../currency-formatter/currencyFormatter';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { cartItemsLength, updateCartCount } = useContext(CartContext);
  const [isCustomer, setIsCutomer] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    let token = localStorage.getItem("token");
    let isTokenValid = false;
    let userId = null;
    let isAdmin;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiryTime = decoded.exp;
        isAdmin = decoded.role;
        userId = decoded.id;
        const currentTime = Math.floor(Date.now() / 1000);
        isTokenValid = currentTime < expiryTime;
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }


    if (token && isTokenValid === true && userId !== null && isAdmin === "user") {
      try {
        const response = await axios.get(`http://localhost:4000/api/fetchcart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsCutomer(true);
        setCartItems(response.data.cart);
        const total = response.data.cart.reduce((acc, item) => {
          const price = parseFloat(item.product.price);
          const quantity = item.quantity || 1;
          return !isNaN(price) ? acc + (price * quantity) : acc;
        }, 0);

        setTotalAmount(total.toFixed(2));
      } catch (error) {
        console.error("Error fetching cart from DB:", error.response);
        toast.error(error.response?.data?.message || "Failed to fetch cart");
      }
    } else {
      const storedCart = JSON.parse(sessionStorage.getItem("sessionCart")) || [];
      setCartItems(storedCart);

      const total = storedCart.reduce((acc, item) => {
        const price = parseFloat(item.price);
        const quantity = item.quantity || 1;
        return !isNaN(price) ? acc + (price * quantity) : acc;
      }, 0);

      setTotalAmount(total.toFixed(2));
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    setTotalAmount(total);
  };

  const handleQuantityChange = (id, action) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        if (action === 'increase') {
          item.quantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
          item.quantity -= 1;
        }
      }
      return item;
    });
    setCartItems(updatedCart);
    sessionStorage.setItem('sessionCart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const updateCartItemQuantity = async (cartId, pro_id, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:4000/api/updatequantity`, {
        cart_id: cartId,
        pro_id: pro_id,
        quantity: newQuantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      toast.error('Error updating quantity');
    }
  };

  const handleRemoveItem = async (id) => {
    if (isCustomer) {
      try {
        let token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:4000/api/deletecart/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          updateCartCount(cartItemsLength - 1);
          fetchCart();
        } else {
          toast.error('Failed to remove item from the cart');
        }
      } catch (error) {
        console.error('Error removing item from cart:', error);
        toast.error('Error removing item from cart');
      }
    } else {
      let storedCart = JSON.parse(sessionStorage.getItem("sessionCart")) || [];
      const updatedCart = storedCart.filter(item => item.pro_id !== id);
      setCartItems(updatedCart);
      sessionStorage.setItem('sessionCart', JSON.stringify(updatedCart));
      updateCartCount(updatedCart.length);
      calculateTotal(updatedCart);
    }
  };


  const handleDecrease = async (cart_id, pro_id, currentQuantity) => {
    try {
      if (currentQuantity > 1) {
        await updateCartItemQuantity(cart_id, pro_id, currentQuantity - 1);
        fetchCart();
      } else {
        console.log('Quantity cannot be decreased further or item not found');
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      toast.error('Something went wrong');
    }
  };

  const handleIncrease = async (cart_id, pro_id, currentQuantity) => {
    try {
      const product = cartItems.find((cartItem) => cartItem.product.id === pro_id);
      if (currentQuantity >= product.product.quantity) {
        toast.warning(`Insufficient Quantity Available. We only have ${product.quantity} products in stock. Please adjust your quantity accordingly`);
        return;
      }
      else if (currentQuantity === 10) {
        toast.warning('You can buy upto maximum 10 items');
        return;
      }
      else {
        await updateCartItemQuantity(cart_id, pro_id, currentQuantity + 1);
        fetchCart();
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
      toast.error(`Something went wrong`);
    }
  };

  const addAddress = async () => {
    const isInsufficientQuantity = cartItems.some((item) => {
      if (item.quantity >= item.product.quantity) {
        toast.warning(`Insufficient Quantity Available. We only have ${item.product.quantity} products in stock. Please adjust your quantity accordingly`);
        return true;
      }
      return false;
    });

    if (isInsufficientQuantity) {
      return;
    }

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    let isTokenValid = currentTime < expiryTime;

    if (!token || !isTokenValid) {
      toast.warning("Login to buy product");
      return;
    }
    navigate("/addaddress");
  }

  return (
    <div className='bg-gray-800 lg:h-[100vw] md:h-[100vw]'>
      <Navigation />
      <div style={{ padding: '20px' }}>
        <h2 className='text-white px-16 font-bold text-3xl'>Your Cart</h2>

        {
          !isCustomer ? <>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'white', fontSize: '20px', marginTop: '20px' }}>
                <h1>No Items in Cart</h1>
              </div>
            ) : (
              <TableContainer component={Paper} sx={{ bgcolor: '#1E293B', paddingLeft: "16px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', textAlign: "center" }}>Product</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: "center" }}>Price</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: "center" }}>Quantity</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: "center" }}>Total</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: "center" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ color: 'white', display: "flex", alignItems: "center", fontSize: "16px", textAlign: "center" }}>
                          <img
                            src={item.imageUrl}
                            alt={item.imageUrl}
                            className={`w-16 object-cover mx-8 cursor-pointer rounded-md'}`}
                          />
                          {item.name}</TableCell>
                        <TableCell sx={{ color: 'white', textAlign: "center", fontSize: "16px" }}>{MyCurrencyFormatter(item.price)}</TableCell>
                        <TableCell sx={{ color: 'white', textAlign: "center" }}>
                          <Button variant="contained" onClick={() => handleQuantityChange(item.id, 'decrease')}>-</Button>
                          <span style={{ margin: '0 10px', fontSize: "15px" }}>{item.quantity}</span>
                          <Button variant="contained" onClick={() => handleQuantityChange(item.id, 'increase')}>+</Button>
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontSize: "16px", textAlign: "center" }}>{MyCurrencyFormatter((parseFloat(item.price) * item.quantity).toFixed(2))}</TableCell>
                        <TableCell sx={{ color: 'white', textAlign: "center" }}>
                          <Button variant="contained" color="error" onClick={() => handleRemoveItem(item.pro_id)}>Remove</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {
              cartItems.length > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <h3 className='font-bold px-5 text-3xl text-gray-200'>Total: {MyCurrencyFormatter(totalAmount)}</h3>
                  <Button variant="contained" onClick={addAddress} color="primary" style={{ marginTop: '10px' }}>
                    Add Address
                  </Button>
                </div>
              )
            }
          </> : <>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'white', fontSize: '20px', marginTop: '20px' }}>
                <h1>No Items in Cart</h1>
              </div>
            ) : (
              <TableContainer component={Paper} sx={{ bgcolor: '#1E293B', paddingLeft: "16px" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', textAlign: "center" }}>Product</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: "center" }}>Price</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: "center" }}>Quantity</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: "center" }}>Total</TableCell>
                      <TableCell sx={{ color: 'white', textAlign: "center" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ color: 'white', display: "flex", alignItems: "center", fontSize: "16px", textAlign: "center" }}>
                          <img
                            src={item.product?.images[0].imageUrl}
                            alt={item.imageUrl}
                            className={`w-16 object-cover mx-8 cursor-pointer rounded-md'}`}
                          />
                          {item.product?.name}</TableCell>
                        <TableCell sx={{ color: 'white', textAlign: "center", fontSize: "16px" }}>{MyCurrencyFormatter(item.product?.price)}</TableCell>
                        <TableCell sx={{ color: 'white', textAlign: "center" }}>
                          <Button variant="contained" onClick={() => handleDecrease(item.id, item.product.id, item.quantity)}>-</Button>
                          <span style={{ margin: '0 10px', fontSize: "15px" }}>{item.quantity}</span>
                          <Button variant="contained" onClick={() => handleIncrease(item.id, item.product.id, item.quantity,)}>+</Button>
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontSize: "16px", textAlign: "center" }}>{MyCurrencyFormatter((parseFloat(item.product.price) * item.quantity).toFixed(2))}</TableCell>
                        <TableCell sx={{ color: 'white', textAlign: "center" }}>
                          <Button variant="contained" color="error" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {
              cartItems.length > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <h3 className='font-bold px-5 text-3xl text-gray-200'>Total: {MyCurrencyFormatter(totalAmount)}</h3>
                  <Button variant="contained" onClick={addAddress} color="primary" style={{ marginTop: '10px' }}>
                    Add Address
                  </Button>
                </div>
              )
            }
          </>
        }
      </div>
    </div>
  );
}

export default Cart;
