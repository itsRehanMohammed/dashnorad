import axios from "axios";

const userData = async () => {
    try {
        const response = await axios.get("https://dukan.onrender.com/api/me", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = response.data;
        localStorage.setItem("username", data.name);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", data.email);
        // setRole(data.role); // If needed, set the role state

        return data; // You can return the user data if you need to use it in your component
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error; // If you want to propagate the error to the caller
    }
};

export default userData;
