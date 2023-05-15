import '../App.css';
import React, { useEffect } from 'react';
import { Grid, Box, CircularProgress } from '@mui/material';
import TodoForm from "../components/todoForm";
import ListFormat from '../components/listFormat';
import { green } from '@mui/material/colors';
import { checkCurrUser } from '../controllers/userController';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import PrimarySearchAppBar from '../components/profileNav';
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
            <Grid container item xs={12} spacing={4}>
                <Grid item xs={12} sm={12} lg={12}>
                    <PrimarySearchAppBar />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <h3 style={{ color: green[900], marginBottom: "20px" }}>Add todos</h3>
                    <TodoForm />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <h3 style={{ color: green[900], marginBottom: "20px" }}>Recent todos</h3>
                    {user ? <ListFormat /> : <CircularProgress sx={{ marginLeft: "20px" }} color='success' />}
                </Grid>
            </Grid>
        </Box >
    );
};


export default Home;