import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from '../src/Components/customer/Home'
import Login from './Components/auth/Login'
import Register from './Components/auth/Register'
import { BrowserRouter } from 'react-router-dom';
import Cart from './Components/customer/Cart'
import SendEmail from './Components/auth/SendEmail'
import OTP from './Components/auth/OTP'
import UpdatePassword from './Components/auth/UpdatePassword'
import DashBoard from './Components/admin/DashBoard'
import Users from './Components/admin/Users'
import Categories from './Components/admin/Categories'
import Products from './Components/admin/Products'
import Orders from './Components/admin/Orders'
import EditCategory from './Components/admin/EditCategory'
import EditProduct from './Components/admin/EditProduct'
import Product from './Components/customer/Product'
import CategoryWise from './Components/customer/CategoryWise'
import { CartProvider } from './Components/context/CartContext'
import AddAddress from './Components/customer/AddAddress'
import PlaceOrder from './Components/customer/PlaceOrder'
import YourOrders from './Components/customer/YourOrders'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <div>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/addtocart' element={<Cart />} />
            <Route path='/sendemail' element={<SendEmail />} />
            <Route path='/otp' element={<OTP />} />
            <Route path='/updatepassword' element={<UpdatePassword />} />
            <Route path='/dashboard' element={<DashBoard />} />
            <Route path='/users' element={<Users />} />
            <Route path='/categories' element={<Categories />} />
            <Route path='/products' element={<Products />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/editcategory/:id' element={<EditCategory />} />
            <Route path='/editproduct/:id' element={<EditProduct />} />
            <Route path='/product/:id' element={<Product />} />
            <Route path='/categorywise/:name' element={<CategoryWise />} />
            <Route path='/addaddress' element={<AddAddress />} />
            <Route path='/placeorder' element={<PlaceOrder />} />
            <Route path='/yourorders' element={<YourOrders />} />
          </Routes>
          <ToastContainer
            position="top-center"
            autoClose={299}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </BrowserRouter>
      </CartProvider>
    </div>
  )
}

export default App
