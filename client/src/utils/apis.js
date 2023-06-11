let headers = new Headers();
headers.append('Content-Type', 'application/json');


export const API = async (method, route, body) => {
    let resp;
    if (method === "GET" || method === "DELETE") {
        resp = await fetch(`/${route}`, {
            method: method,
            credentials: 'include',
            headers: headers
        });
    } else {
        resp = await fetch(`/${route}`, {
            method: method,
            credentials: 'include',
            headers: headers,
            body: JSON.stringify(body)
        });

    }
    let data = await resp.json();
    return data;
}

