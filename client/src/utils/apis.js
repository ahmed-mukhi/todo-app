let headers = new Headers();
headers.append('Content-Type', 'application/json');

export const API = async (method, route, body) => {
    let resp;
    const options = {
        method: method,
        credentials: 'include',
        headers: headers,
    };

    if (method === "GET" || method === "DELETE") {
        resp = await fetch(`/${route}`, options);
    } else {
        options.body = JSON.stringify(body);
        resp = await fetch(`/${route}`, options);
    }

    let data = await resp.json();
    return data;
};

