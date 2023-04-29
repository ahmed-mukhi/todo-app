import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
// import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import TodoForm from "../components/todoForm";
import { Box } from "@mui/material";
import ListFormat from '../components/listFormat';
import { green } from '@mui/material/colors';
import '../App.css';
import { checkCurrUser } from '../controllers/userController';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { FormContext } from '../App';

const Home = () => {
    const nav = useNavigate();
    const { user, setUser } = useContext(FormContext);
    useEffect(() => {
        checkCurrUser().then(rsp => {
            console.log(rsp);
            if (rsp.error === "Not found") {
                nav("/login");
            } else {
                setUser(rsp);
            }
        });
    }, []);



    return (
        <Box sx={{ flexGrow: 1 }}>

            <h1 style={{ color: green[900] }}>Recent todos</h1>
            <Grid container item xs={12} spacing={4}>
                <Grid item xs={12} sm={12} lg={12}>
                    <Chip label={`UserName : ${user.firstName}${user.lastName}`} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ListFormat />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TodoForm />
                </Grid>
            </Grid>
        </Box>
    );
};


export default Home;