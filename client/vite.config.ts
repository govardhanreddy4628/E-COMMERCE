import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api' : 'http://localhost:8000'    //this is server adress
  //   }
  // },      //this is the one way we can connect frontend with backend instead of cors. in backend we request like app.get('/api/users', (req, res) =>{res.send("hello")}) 
  plugins: [react()],
  server: {
    open: true, // Automatically open the browser when the server starts
  }
})
