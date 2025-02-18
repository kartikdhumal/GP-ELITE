import { useContext, useEffect, useRef, useState } from "react";
import { Search, ShoppingCartIcon, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, Badge, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack, Tooltip } from '@mui/material'
// import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import axios from "axios";
import { CartContext } from "../context/CartContext";
import TocIcon from '@mui/icons-material/Toc';
import { toast } from "react-toastify";

function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCustomer, setCustomer] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchquery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { cartItemsLength } = useContext(CartContext);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


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

    const searchProducts = async (e) => {
        try {
            if (!e || !e.target) return;
            setSearchQuery(e.target.value.trim());
            if (searchquery.length > 1) {
                let response = await axios.get(`http://localhost:4000/api/searchproduct/${searchquery}`);
                if (response.status === 200) {
                    setSearchResults(response.data.products);
                }
            }
            else {
                setSearchResults([]);
            }
        }
        catch (err) {
            console.error('Error searching products:', err);
        }
    }


    const fetchUserDetails = async () => {
        let token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await axios.get('http://localhost:4000/api/getuserdetails', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.data) {
                const expiryTime = response.data.exp
                const currentTime = Math.floor(Date.now() / 1000);
                if (currentTime < expiryTime) {
                    setCustomer(false);
                    localStorage.removeItem("token");
                }
                else {
                    setUserDetails(response.data.userDetails);
                    setCustomer(true);
                }
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [])

    return (
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50" ref={searchContainerRef}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to={'/'} className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold tracking-wide">GP Elite</h1>
                    <span className="text-xs text-gray-400">Guddu Pandit</span>
                </Link>

                <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-md text-lg font-semibold">
                    {isCustomer ? `Welcome, ${userDetails?.name ?? ""} 🙋🏻‍♂️` : "Welcome, Visitor 🙋🏻‍♂️"}
                </div>

                <div className="flex flex-col justify-center items-center w-auto">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            value={searchquery}
                            onChange={(e) => searchProducts(e)}
                            onMouseLeave={(e) => e.target.value < 1 && setSearchResults([])}
                            placeholder="Search for products..."
                            className="w-96 py-2 pl-12 pr-4 text-white bg-gray-800/80 backdrop-blur-md rounded-full border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
                        />
                        <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                    </div>
                    <div className="searchresult flex justify-center">
                        {searchResults && searchResults.length > 0 && (
                            <ul className="absolute bg-gray-900 border mt-3 rounded-lg shadow-md h-auto">
                                {searchResults.map((product) => (
                                    <li key={product.id} className="font-bold border-gray-700  text-blue-900 flex justify-start items-center px-2 py-2 rounded-lg border-b-1 cursor-pointer hover:bg-gray-700" onClick={() => navigate(`/product/${product.id}`)}>
                                        <img src={product.images[0].imageUrl} className="w-10 object-cover cursor-pointer rounded-xl mx-3 bg-sky-100"></img> <span className=" text-sky-100  w-full p-2 rounded-md"> {product.name} </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="hidden md:flex space-x-6 justify-center items-center">
                    <Link to="/addtocart" className="hover:text-blue-400 transition">
                        {
                            <Stack spacing={4} direction="row">
                                {cartItemsLength > 0 ? (
                                    <Badge color="primary" badgeContent={cartItemsLength}>
                                        <ShoppingCartIcon />
                                    </Badge>
                                ) : (
                                    <ShoppingCartIcon />
                                )}
                            </Stack>

                        }
                    </Link>
                    {
                        isCustomer ? <>
                            <Tooltip title="Profile">
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar src={'/icon2.png'} sx={{
                                        '&:hover': {
                                            backgroundColor: "white", transition: "color 0.3s ease-in"
                                        }, width: 32, height: 32, padding: "5px", backgroundColor: "#90caf9", color: "#001f50"
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
                                        backgroundColor: "#101828",
                                        border: "1px solid white",
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
                                            bgcolor: "white",
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleClose} sx={{ backgroundColor: "#101828", borderBottom: "1px solid white", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Avatar src={'/icon2.png'} sx={{
                                        '&:hover': {
                                            backgroundColor: "white", transition: "color 0.3s ease-in"
                                        }, width: 32, height: 32, padding: "5px", backgroundColor: "#90caf9", color: "#001f50"
                                    }}></Avatar>
                                    {
                                        <span className="font-bold text-md text-[#90caf9] bg-[#101828] px-2 py-2 rounded-md">{userDetails?.name ? userDetails?.name : 'USER'}</span>
                                    }
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleClose} sx={{ color: "white", display: "flex", justifyContent: "start", alignItems: "center" }}>
                                    <ListItemIcon>
                                        <TocIcon fontSize="small" sx={{ color: "white" }} />
                                    </ListItemIcon>
                                    <Link to={`/yourorders`} > Your Orders </Link>
                                </MenuItem>
                                <MenuItem onClick={handleLogout} sx={{ color: "white", display: "flex", justifyContent: "start", alignItems: "center" }}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" sx={{ color: "white" }} />
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
                    <Link to="/addtocart" className="hover:text-blue-400 transition">
                        <ShoppingCartIcon />
                    </Link>
                    <NavLink to="/login" className="lg:w-auto sm:w-auto cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center ml-2">Login</NavLink>
                    <NavLink to="/register" className="lg:w-auto sm:w-auto cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center ml-2">Register</NavLink>
                </div>
            )}
        </nav>
    );
}

export default Navigation;
