import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
// import {data} from "../data/data"
import StarRating from "./starRating"
import { Product } from "../types/types"
import { useDispatch, useSelector } from "react-redux"
import { productData } from "../redux/actions/productAction"

const Hero = () => {

  const { data, loading, error } = useSelector((state) => state.product);
  const [data1, setData1] = useState<Product[]>(data)
  const [search, setSearch] = useState("")
  const buttons = ["jewelery", "electronics", "men's clothing", "women's clothing"] as const;
//   type buttons = typeof buttons[number];
//   //the above two lines of code is similar to type buttons = "jewelery" | "electronics" | "men's clothing" | "women's clothing";
  const [filterbuttons, setFilterbuttons] = useState<string[]>([])
  const dispatch = useDispatch()


  const handleClick = (filterbutton: string) => {
    if (!filterbuttons.includes(filterbutton)) { setFilterbuttons((prev) => [filterbutton, ...prev]) }
    else { setFilterbuttons(filterbuttons.filter((item) => item !== filterbutton)) }
  }

  useEffect(() => {
    const filteredByCategory = filterbuttons.length > 0
      ? data.filter((product) => filterbuttons.includes(product.category))
      : data;
  
    if (search) {
      const filteredBySearch = filteredByCategory.filter((product) =>
        product.title.toLowerCase().trim().includes(search.toLowerCase().trim())
      );
      setData1(filteredBySearch);
    } else {
      setData1(filteredByCategory);
    }
  }, [filterbuttons, search, data]);

  useEffect(()=>{
    dispatch(productData())
  },[dispatch])

  if (loading) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  // Show error message if there's an error
  if (error) {
    return <Typography variant="h5" color="error">Error: {error.message}</Typography>;
  }

  
  return (
    <>
      <Box sx={{ padding: "20px" }}>
        <TextField
          type="text"
          variant="outlined"
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ marginBottom: "20px" }}
        />
      </Box>

      <Box sx={{ marginBottom: "20px" }}>
        {buttons.map((filterbutton, id) => {
          const isInclude = filterbuttons.includes(filterbutton)
          return (
            <Button key={id} variant={"contained"} sx={{ backgroundColor: isInclude ? "black" : "white", color: isInclude ? "white" : "black", margin: "10px", "&:hover":{backgroundColor: isInclude ? "black" : "#f0f0f0"} }} onClick={() => handleClick(filterbutton)}>{filterbutton}</Button>
          )
        })}
        <Button variant={"contained"} onClick={()=>{setFilterbuttons([])}} sx={{marginLeft:"10px"}}>clear Filters</Button>
      </Box>
        
      <Grid container spacing={3}>
        {(data1 && data1.length > 0) && data1.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card sx={{display: 'flex',flexDirection: 'column',alignItems: 'center',
              padding: 2,height: "100%",boxShadow: 3,borderRadius: 2
            }}>
              <CardMedia
                component="img"
                alt={product.title}
                image={product.image}
                sx={{
                  objectFit: "contain",
                  height: "200px",
                  width: "100%",
                  borderRadius: 1
                }}
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600, textAlign: 'center', marginBottom: 1 }}>
                  {product.title.slice(0, 30)}...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', marginBottom: 1 }}>
                  {product.description.slice(0, 50)}...
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ${product.price}
                </Typography>
                <Box><StarRating/></Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', width: '100%' }}>
                <Button size="small" variant="outlined" sx={{ marginRight: 1 }}>Share</Button>
                <Button size="small" variant="contained">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>


    </>
  )
}

export default Hero;
