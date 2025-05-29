import { Box, Grid, Grid2, Paper, TextField, Typography } from "@mui/material"
import { useRef } from "react"

const Login = () => {
  const reference = useRef([])
  console.log(reference.current)
  return (
    <Box>
      <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} sx={{display:"flex", alignItems:"center", justifyContent:"center", height:"100vh"}}>
        <Grid item sm={6} >
          <Paper elevation={10}>
          <Box sx={{textAlign:"center"}}><Typography>LogIn</Typography></Box>
          <Grid item sx={{display:"flex",justifyContent:"center", alignItems:"center", marginBottom:"10px", flexDirection:"column"}} sm={12}>
            <Grid item sm={12}><TextField type="text" variant="outlined" size="medium" sx={{margin:"10px"}} ref={(inpu)=>{reference.current[0]=inpu}}></TextField></Grid>
            <Grid item sm={12}><TextField type="password" variant="outlined" size="medium" sx={{margin:"10px"}}></TextField></Grid>
            <Grid item sm={12}><TextField type="password" variant="outlined" size="medium" sx={{margin:"10px"}}></TextField></Grid>
            <Grid item sm={12}><TextField type="password" variant="outlined" size="medium" sx={{margin:"10px"}}></TextField></Grid>
            <Grid item sm={12}><TextField type="password" variant="outlined" size="medium" sx={{margin:"10px"}}></TextField></Grid>
            <Grid item sm={12}><TextField type="password" variant="outlined" size="medium" sx={{margin:"10px"}}></TextField></Grid>
          </Grid>
          </Paper>
            

        </Grid>
      </Grid>
    </Box>
  )
}

export default Login
