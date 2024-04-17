/* eslint-disable consistent-return */
import axios from "axios";
export const userLogin = async (credentials) => {
    try {
        const response = await axios.post(`https://dukan.onrender.com/api/login`, {
            email: credentials.email,
            password: credentials.password,
        });
        // Handle response data here if needed
        return response;
    } catch (error) {
        // Handle errors here
        console.log("Error:", error);
        throw error; // If you want to propagate the error to the caller
    }
};

export default userLogin;
