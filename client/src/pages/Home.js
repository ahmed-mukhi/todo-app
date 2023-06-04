import '../App.css';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, LinearProgress, Button } from '@mui/material';
import { logOutUser } from '../controllers/userController';
import ListFormat from '../components/listFormat';
import { checkCurrUser } from '../controllers/userController';
import { useContext } from 'react';
import FilterAndSearch from '../components/FilterAndSearch';
import { FormContext } from '../App';

const Home = () => {
    const nav = useNavigate();
    const { setUser, user } = useContext(FormContext);

    const checkUser = async () => {
        try {
            let resp = await checkCurrUser();
            resp.error ? nav("/login") : setUser(resp);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkUser();
    }, []);



    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid
                container
                item
                xs={12}
                spacing={4}>
                <Grid
                    container
                    item
                    xs={12}
                    spacing={4}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid item>
                        <h1>Dashboard</h1>
                    </Grid>
                    <Grid item>
                        <Button variant='primary' color='secondary' onClick={() =>
                            logOutUser().then((snap) => {
                                if (snap) {
                                    nav("/login");
                                }
                            })
                        }>Log out</Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                    {user ? (<FilterAndSearch />) : <LinearProgress />}
                </Grid>
                <Grid item xs={12} sm={12}>
                    {user ? <ListFormat /> : <LinearProgress sx={{ marginLeft: "20px" }} color='success' />}
                </Grid>
            </Grid>
        </Box >
    );
};


export default Home;