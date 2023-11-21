
const { API } = require("../utils/apis");

export async function registerUser(obj) {
    try {
        let data = await API('POST', 'user/signup', obj);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function editUserDetails(id, obj) {
    try {
        let data = await API('PATCH', `user/edit/${id}`, obj);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function checkCurrUser() {
    try {
        return await API("POST", "user/currUser", {});
    } catch (error) {
        console.log(error.message);
    }
}

export async function verifyCaptcha(val) {
    try {
        return await API("POST", "user/verify", { val });
    } catch (error) {
        console.error(error);
    }
}

export async function logOutUser() {
    try {
        return await API("GET", "user/logout");
    } catch (error) {
        console.log(error);
    }
}

export async function LoginUser(obj) {
    try {
        const data = await API('POST', 'user/login', obj);
        return data;
    } catch (error) {
        console.log(error);
    }

}