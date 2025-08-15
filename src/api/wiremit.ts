import axios from "axios";

const API = axios.create({   baseURL: "https://supreme-waffle-x5xvq76gwxp6c6rqg-8080.app.github.dev" 
});

export const signup = (data: any) => API.post("/signup", data);
export const login = (data: any) => API.post("/login", data);
export const getRates = () => API.get("/rates");
