import { Box, Grid } from "@mui/material";
import Container from "@mui/material/Container";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { BASE_URL } from "../constants/baseUrl";

const HomePage = () => {
  const [prodcuts, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<any>(false);

  useEffect(() => {
   const fetchProducts =  async () => {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      const data = await response.json();
      setProducts(data);
    } catch {
      setError(true);
    }
  }
    
    fetchProducts();
  }, []);


if (error) {
  return <Box>Something went wrong!</Box>;
}

  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {/* {prodcuts.map(({_id, title, image, price}) => (
          <Grid size={4}>
            <ProductCard title ={title} image = {image} price = {price} />
          </Grid>
        ))} */
        
        // Better way to pass all props using spread operator
        prodcuts.map((p) => (
          <Grid key={p._id} size={4}>
            <ProductCard {...p} />
          </Grid>
        )) 
        
        }
      </Grid>
    </Container>
  );
};

export default HomePage;
