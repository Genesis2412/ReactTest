import React from "react";
import {
  Grid,
  Paper,
  Box,
  Card,
  Typography,
  CardContent,
  CardActionArea,
  CardMedia,
  CardActions,
  Button,
  Avatar,
  Container,
} from "@mui/material";
import { Boxes, Avatarx } from "./ClassesElements";

const Classes = () => {
  return (
    <>
      <Grid container rowSpacing={4} spacing={2}>
        <Grid item xs={11} md={3}>
          <Box>
            <Card variant="outlined" style={{ backgroundColor: "#c5c6c7" }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="150"
                  image="https://sbooks.net/wp-content/uploads/2021/10/old-book-flying-letters-magic-light-background-bookshelf-library-ancient-books-as-symbol-knowledge-history-218640948.jpg"
                  alt="picture"
                />
                <Avatarx
                  alt="Remy Sharp"
                  src="https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW4lMjBmYWNlfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Post Malone
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with
                    over 6,000 species, ranging across all continents except
                    Antarctica
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  Share
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Classes;
