import { useEffect, useState } from "react";
import { ShoppingCartIcon, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
// import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { jwtDecode } from 'jwt-decode'
import { toast } from "react-toastify";

function AdminNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        localStorage.removeItem("token");
        toast.success('You have been successfully logged out');
        navigate('/login');
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.role === "user") {
                navigate('/login');
            } else {
                setAdmin(true);
                setUserDetails(decoded);
            }
        }
        catch (err) {
            console.error("Invalid token:", err);
            navigate('/login');
        }

    }, [navigate])

    return (
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold tracking-wide">GP Elite</h1>
                    <span className="text-xs text-gray-400">Guddu Pandit</span>
                </div>

                <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-md text-lg font-semibold">
                    Welcome, <span className="text-blue-400">Admin Saheb</span> - {userDetails && userDetails?.name}
                </div>

                <div className="links">
                    <NavLink to={'/dashboard'} className={({ isActive }) =>
                        `p-2 text-md ${isActive ? "text-blue-500 font-bold border-b-2 border-blue-500" : "text-gray-400"}`
                    }>home</NavLink>
                    <NavLink to={'/users'} className={({ isActive }) =>
                        `p-2 text-md ${isActive ? "text-blue-500 font-bold border-b-2 border-blue-500" : "text-gray-400"}`
                    }>users</NavLink>
                    <NavLink to={'/categories'} className={({ isActive }) =>
                        `p-2 text-md ${isActive ? "text-blue-500 font-bold border-b-2 border-blue-500" : "text-gray-400"}`
                    }>category</NavLink>
                    <NavLink to={'/products'} className={({ isActive }) =>
                        `p-2 text-md ${isActive ? "text-blue-500 font-bold border-b-2 border-blue-500" : "text-gray-400"}`
                    }>product</NavLink>
                    <NavLink to={'/orders'} className={({ isActive }) =>
                        `p-2 text-md ${isActive ? "text-blue-500 font-bold border-b-2 border-blue-500" : "text-gray-400"}`
                    }>orders</NavLink>
                </div>

                <div className="hidden md:flex space-x-6 justify-center items-center">
                    {
                        isAdmin ? <>
                            <Tooltip title="Profile">
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar src={'/logo.svg'} sx={{
                                        '&:hover': {
                                            backgroundColor: "white", transition: "color 0.3s ease-in"
                                        }, width: 32, height: 32, backgroundColor: "#90caf9", color: "#001f50"
                                    }}></Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                className='menu'
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        borderRadius: "10px",
                                        backgroundColor: "#EDF4F2",
                                        color: "#001f50",
                                        fontWeight: "bold",
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&::before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: "#001f50",
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Avatar src={'avatar'} sx={{ width: 32, height: 32, backgroundColor: "#001f50", color: "#90caf9" }}></Avatar>
                                    {
                                        userDetails?.name ? userDetails?.name : 'USER'
                                    }
                                </MenuItem>
                                <Divider />
                                {/* <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" sx={{ color: "#001f50" }} />
                                    </ListItemIcon>
                                    <NavLink to={`/editprofile/${userDetails?.id}`}> Profile </NavLink>
                                </MenuItem> */}
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" sx={{ color: "#001f50" }} />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </> : <>
                            <div className="hidden md:flex space-x-4">
                                <NavLink to="/login" className="lg:w-auto sm:w-auto cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center ml-2">Login</NavLink>
                                <NavLink to="/register" className="lg:w-auto sm:w-auto cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center ml-2">Register</NavLink>
                            </div>
                        </>
                    }
                </div>


                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden flex flex-col items-center space-y-4 py-4 bg-gray-800">
                    <a href="/addtocart" className="hover:text-blue-400 transition">
                        <ShoppingCartIcon />
                    </a>
                    <NavLink to="/login" className="lg:w-auto sm:w-auto cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center ml-2">Login</NavLink>
                    <NavLink to="/register" className="lg:w-auto sm:w-auto cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center ml-2">Register</NavLink>
                </div>
            )}
        </nav>
    );
}

export default AdminNavbar;
