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

export async function DelTodos(id) {
    try {
        let data = await API("DELETE", `todo/del/${id}`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function EditTodos(id, obj) {
    try {
        await API("PATCH", `todo/edit/${id}`, obj);
    } catch (error) {
        console.log(error);
    }
}

export async function SaveTodos(uid, obj) {
    try {
        const data = await API("POST", `todo/add/${uid}`, obj);
        return data;
    } catch (error) {
        console.log(error);
    }
}

