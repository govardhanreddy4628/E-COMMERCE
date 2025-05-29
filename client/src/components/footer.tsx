import { Box, Typography } from '@mui/material';

const Footer = () => {
  navigator.geolocation.getCurrentPosition((location)=>{
    console.log(location)
  },
()=>{console.log("no location")})
  return (
    <Box >
      <Typography variant='caption'>
        this is the footer component
      </Typography>
    </Box>
  )
}

export default Footer
