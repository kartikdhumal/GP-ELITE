import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import MyCurrencyFormatter from "../currency-formatter/currencyFormatter";

function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/getorders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fetchedOrders = response.data.orders;
      setOrders(fetchedOrders);
      const total = fetchedOrders.reduce((acc, order) => acc + parseInt(order.totalAmount, 10), 0);
      setTotalSales(total);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/getproducts');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/getusers");
        let users = response.data.users.filter(user => user.role !== "admin");
        setUserCount(users.length);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
    fetchOrders();
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen">
      <AdminNavbar />
      <div className="container p-18 mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className=" shadow-lg rounded-lg p-6 bg-[#101828] flex border-2 border-gray-200 hover:bg-gray-800 flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-200">Total Users</h2>
            <p className="text-3xl font-bold text-gray-200 mt-2">{userCount}</p>
          </div>
          <div className=" shadow-lg rounded-lg p-6 flex border-2 bg-[#101828] border-gray-200 hover:bg-gray-800 flex-col items-center">
            <h2 className="text-xl font-semibold  text-gray-200">Total Sales</h2>
            <p className="text-3xl font-bold flex items-center justify-center text-gray-200 mt-2">{MyCurrencyFormatter(totalSales)}</p>
          </div>
          <div className=" shadow-lg rounded-lg p-6 flex bg-[#101828] border-2 border-gray-200 hover:bg-gray-800 flex-col items-center">
            <h2 className="text-xl font-semibold  text-gray-200">Total Orders</h2>
            <p className="text-3xl font-bold text-gray-200 mt-2">{orders.length}</p>
          </div>
          <div className=" shadow-lg rounded-lg p-6 bg-[#101828] flex border-2 border-gray-200 hover:bg-gray-800 flex-col items-center">
            <h2 className="text-xl font-semibold  text-gray-200">Total Products</h2>
            <p className="text-3xl font-bold flex items-center justify-cente text-gray-200 mt-2">{products.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
