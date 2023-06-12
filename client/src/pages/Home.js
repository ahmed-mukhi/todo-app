import '../App.css';
import React, { useEffect, useState } from 'react';
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
    const { setUser, user, change } = useContext(FormContext);
    const [imgUrl, setImgUrl] = useState("");
    const [data, setData] = useState([]);

    const handleLogout = async () => {
        let resp = await logOutUser();
        if (resp) {
            nav("/login");
        }
    }

    const checkUser = async () => {
        try {
            let resp = await checkCurrUser();

            if (resp.error) {
                nav("/login");
            } else {
                resp.profileImage.replace('\\', '/');
                setUser(resp);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkUser();
    }, []);

    const fetch = async () => {
        const resp = await getTodos(user._id);
        // const image = fetch(``);
        setImgUrl(`https://todo-app-sqnm.vercel.app/${user.profileImage}`);
        setData(resp.todos);
    }


    useEffect(() => {
        if (user) {
            fetch();
        }
    }, [user, change]);



    return (
        <Box sx={{ flexGrow: 1 }}>
            {user && imgUrl && data ?
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
                            <UserMenu user={user} imgUrl={imgUrl} handleLogout={handleLogout} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FilterAndSearch />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <ListFormat />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TodosChart todos={data} />
                    </Grid>
                </Grid>
                : <CircularProgress />}
        </Box >
    );
};


export default Home;