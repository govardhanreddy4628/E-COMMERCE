import { createTheme } from "@mui/material";
import { brown } from "./colors";

export const theme = createTheme({
    
        palette:{
            primary:{
                main:brown
            }
        },
        components:{
            MuiButton:{
                styleOverrides:{
                    root:{
                        textTransform: "none"
                    }
                }
            },
            
            MuiTextField: {
                styleOverrides: {
                  root: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px !important", // Apply border radius to the input element
                    //   padding: "10.5px 14px !important", // Apply padding to the input element
                    },
                  }}}
        }
})

