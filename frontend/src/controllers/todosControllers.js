// import React from 'react';

const { API } = require("../utils/apis");

export async function getTodos(uid) {
    try {
        const data = await API('GET', uid);
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

export async function DelTodos(id) {
    try {
        let data = await API("DELETE", id);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function EditTodos(id, title, reminder) {
    try {
        let data = await API("PATCH", id, { title, reminder });
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

export async function SaveTodos(uid, title, reminder) {
    try {
        const data = await API("POST", uid, { title, reminder });
        return data;
    } catch (error) {
        console.log(error);
    }
}

