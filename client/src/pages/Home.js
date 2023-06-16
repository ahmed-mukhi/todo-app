import '../App.css';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, CircularProgress } from '@mui/material';
import { logOutUser } from '../controllers/userController';
import ListFormat from '../components/listFormat';
import { checkCurrUser } from '../controllers/userController';
import { useContext } from 'react';
import FilterAndSearch from '../components/FilterAndSearch';
import { FormContext } from '../App';
import UserMenu from '../components/userMenu';
import TodosChart from '../components/charts';
import { getTodos } from '../controllers/todosControllers';

const Home = () => {
    const nav = useNavigate();
    const { setUser, user, change, setChange } = useContext(FormContext);
    const [imgUrl, setImgUrl] = useState("");
    const [data, setData] = useState([]);
    const [userChange, setUserChange] = useState(false);

    const handleLogout = async () => {
        let resp = await logOutUser();
        if (resp) {
            nav("/login");
        }
    }


    const checkUser = async (signal) => {
        try {
            let resp = await checkCurrUser(signal);

            if (resp.error) {
                nav("/login");
            } else {
                fetch(resp._id);
                setImgUrl(resp.profileImage);
                setUser(resp);
                setUserChange(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const abortControl = new AbortController();
        const { signal } = abortControl;
        checkCurrUser(signal).then(resp => {
            if (resp.error) {
                nav("/login");
            } else {
                fetch(resp._id);
                setImgUrl(resp.profileImage);
                setUser(resp);
            }
        })
        return () => {
            abortControl.abort();
        };
    }, []);



    useEffect(() => {
        const abortControl = new AbortController();
        const { signal } = abortControl;

        if (userChange) {
            checkUser(signal);
        }

        return () => {
            abortControl.abort();
        };
    }, [userChange]);

    const fetch = async (id) => {
        const resp = await getTodos(id);
        setData(resp.todos);
    }

    useEffect(() => {
        if (change && user) {
            fetch(user._id).then(snap => {
                setChange(false);
            })
        }
    }, [change]);



    return (
        <Box sx={{ flexGrow: 1 }}>
            {user && data.length && !change ?
                <Grid container item xs={12} spacing={4}>
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
                            <h2>Dashboard</h2>
                        </Grid>
                        <Grid item>
                            <UserMenu setUserChange={setUserChange} userChange={userChange} user={user} imgUrl={imgUrl} handleLogout={handleLogout} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FilterAndSearch todos={data} />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <ListFormat todos={data} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TodosChart data={data} />
                    </Grid>
                </Grid>
                : <CircularProgress />}
        </Box >
    );
};


export default Home;