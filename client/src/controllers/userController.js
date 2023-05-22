
const { API } = require("../utils/apis");

export async function registerUser(f_name, l_name, email, pass) {
    try {
        const data = await API('POST', 'user/signup', {
            firstName: f_name,
            lastName: l_name,
            email: email,
            password: pass
        });
        return data;

    } catch (error) {
        console.log(error);
    }
}

export async function checkCurrUser() {
    try {
        return await API("POST", "user/currUser", {});
    } catch (error) {
        console.log(error.message);
    }
}

export async function logOutUser() {
    try {
        return await API("GET", "user/logout");
    } catch (error) {
        console.log(error);
    }
}

export async function LoginUser(email, pass) {
    try {
        const data = await API('POST', 'user/login', {
            email: email,
            password: pass
        })
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }

}