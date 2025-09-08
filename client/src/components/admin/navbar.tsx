import { Search, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../../ui/themeToggle';
import { Avatar, Badge, IconButton, ListItemIcon, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { FaRegUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

interface NavbarProps {
    className?: string;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        width: '8px', // for example
        height: '8px',
        borderRadius: '50%',
        // You can position the badge here if needed
        '&::after': {
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
            transformOrigin: 'center',
        },
    },

    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

export function Navbar({ className }: NavbarProps) {

    const [accanchorEl, setAccAnchorEl] = React.useState<null | HTMLElement>(null);
    const adminMenuOpen = Boolean(accanchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAccAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAccAnchorEl(null);
    };

    return (
        <header className={cn("bg-white/95 backdrop-blur-sm sticky top-0 z-10 border-b dark:bg-gray-950")}>
            <div className="container flex items-center justify-between h-16 px-4">
                <h1 className="text-lg font-semibold tracking-tight lg:text-xl"><span className='text-green-500'>Go-</span>Board</h1>
                <div className="flex items-center gap-2 lg:gap-4">

                    <div className="relative hidden md:flex items-center h-9 rounded-md px-3 text-muted-foreground focus-within:text-foreground bg-muted/50 bg-slate-200 dark:bg-gray-600 focus-within:outline-none">
                        <Search className="h-4 w-4 mr-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className={cn(
                                "flex w-full rounded-md border border-input bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                "h-9 w-[200px] lg:w-[280px] bg-transparent border-none px-0 py-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
                            )}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <Tooltip title="Notifications">
                        <IconButton aria-label="bell" >
                            <Bell className='!text-animate-none dark:text-gray-50' />          {/*  this class not working check this later */}
                            <Badge badgeContent={2} color="primary" className='animate-pulse -top-[12px] right-[1px]'></Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Account settings">
                        <div className="flex items-center gap-4 shadow-xs rounded-md cursor-pointer" onClick={handleClick}>
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                variant="dot"
                                sx={{ ml: 1 }}
                                aria-controls={adminMenuOpen ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={adminMenuOpen ? 'true' : undefined}
                            >
                                <div className="overflow-hidden">
                                    <Avatar alt="Go" src="https://i.pravatar.cc/40"
                                        className="w-10 h-10 rounded-full"
                                    />
                                </div>
                            </StyledBadge>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{"john Doe"}</p>
                                <p className="text-xs text-gray-500">{"johndoe@gmail.com"}</p>
                            </div>
                        </div>
                    </Tooltip>

                    <Menu
                        anchorEl={accanchorEl}
                        id="account-menu"
                        open={adminMenuOpen}
                        onClose={handleClose}
                        onClick={handleClose}
                        disableScrollLock={true}
                        slotProps={{
                            paper: {
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    minWidth: 180,
                                    '& .MuiMenuItem-root': {
                                        py: 1, // reduce vertical padding
                                    },
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
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleClose} >
                            <Avatar /> Profile
                        </MenuItem>

                        <Divider />

                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <FaRegUser fontSize="small" />
                            </ListItemIcon>
                            My Profile
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon>
                                <FiLogOut fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        </header>
    );
}
