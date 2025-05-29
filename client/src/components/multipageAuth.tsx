import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import InputField from './input';

const MultipageAuth = () => {
  const [step, setStep] = useState(1)

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

  console.log(step)

  return (
    <div>
      <Grid container spacing={2} size={{ xs: 6, md: 6 }} sx={{ display: "flex", alignItems: "center", justifyContent: "center", border: "solid 2px black"}}>

        <Grid size={{ xs: 12, md: 6 }} sx={{ margin: "10px" }}>
          <InputField type="text" variant="outlined" label="name" required={true} error={false}></InputField>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ margin: "10px" }}>
          <InputField type="text" variant="outlined" label="email" required={false} error={false}></InputField>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ margin: "10px" }}>
          <InputField type="password" variant="outlined" label="phone" required={true} error={false}></InputField>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ margin: "10px" }}>
          {step !== 1 ? <Button variant={"outlined"} onClick={() => setStep((step) => step - 1)}>Back</Button> : null}
          <Button variant={"outlined"} onClick={() => setStep((step) => step + 1)}>Next</Button>
        </Grid>
        <Box sx={{ position: "absolute", right: "15px", top: "15px" }}>
          <Typography>Step {step} / 3</Typography>
        </Box>



      </Grid>

    </div>
  )
}

export default MultipageAuth
