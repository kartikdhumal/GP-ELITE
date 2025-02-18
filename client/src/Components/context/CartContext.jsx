import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItemsLength, setCartItemsLength] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCartFromDB();
    }
  }, []);

  const fetchCartFromDB = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime < expiryTime) {
        const response = await axios.get(`http://localhost:4000/api/fetchcart/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCartItemsLength(response.data.cart.length);
      }
    } catch (error) {
      console.error("Error fetching cart from DB:", error);
    }
  };


  const updateCartCount = (newCount) => {
    setCartItemsLength(newCount);
  };

  return (
    <CartContext.Provider value={{ cartItemsLength, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { CartContext, CartProvider };
