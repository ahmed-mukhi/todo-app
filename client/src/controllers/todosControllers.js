// import React from 'react';

const { API } = require("../utils/apis");

export async function getTodos(uid) {
    try {
        const data = await API('GET', `todo/get/${uid}`);
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

export async function DelTodos(id, uid) {
    try {
        let data = await API("DELETE", `todo/del/${uid}/${id}`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function EditTodos(id, title, reminder) {
    try {
        let data = await API("PATCH", `todo/edit/${id}`, { title, reminder });
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

export async function SaveTodos(uid, title, reminder) {
    try {
        const data = await API("POST", `todo/add/${uid}`, { title, reminder });
        return data;
    } catch (error) {
        console.log(error);
    }
}

