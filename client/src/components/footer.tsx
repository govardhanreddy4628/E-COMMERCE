import { Box, ButtonGroup, Divider, IconButton, Typography } from '@mui/material';
import { SearchIcon } from 'lucide-react';
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";

const Footer = () => {
  navigator.geolocation.getCurrentPosition((location) => {
    console.log(location)
  },
    () => { console.log("no location") })
  return (
    <>
      <div>
        <img />
        <h3></h3>
        <p></p>
      </div>
      <Divider sx={{ margin: '20px 0' }} />

      <div className='flex items-center justify-start gap-4'>
        <div className='flex flex-col items-center gap-4 w-[30%]'>
          <h3>Contact us</h3>
          <p></p>
          <h1>(+91) 9876-543-210</h1>
          <div>
            <img />
            <h3>Online Chat Get Expert Help</h3>
          </div>
        </div>
        <Divider orientation='vertical' />

        <div className='flex  items-center width-[70%] gap-12'>
          <div className='flex flex-col items-center gap-3'>
            <h1>Products</h1>
            <ul>
              <li>Product 1</li>
              <li>Product 2</li>
              <li>Product 3</li>
              <li>Product 4</li>
            </ul>
          </div>
          <div className='flex flex-col items-center gap-4'>
            <h1>Our Company</h1>
            <ul>
              <li>Product 1</li>
              <li>Product 2</li>
              <li>Product 3</li>
              <li>Product 4</li>
            </ul>
          </div>
          <div>
            <h1>Subscribe To Newsletter</h1>
            <p></p>
          </div>
        </div>
      </div>


      
        <Box
        sx={{
          position: 'static',
          bottom: 0,
          width: '100%',
          backgroundColor: '#f8f9fa',
          padding: '10px',
          textAlign: 'center',
          boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 auto',
          alignItems: 'center',
        }}>
        <ButtonGroup color="primary" aria-label="outlined primary button group" sx={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent:"center" }}>
          {[FaFacebookF, FaInstagram, FiYoutube, FaPinterestP].map((Icon, index) => (
            <IconButton aria-label="search" className='!text-red-500' key={index} >
            <Icon className='!text-[32px]' />
            </IconButton>
          ))}
        </ButtonGroup>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </Typography>
      </Box>
      

      
    </>

  )
}

export default Footer
