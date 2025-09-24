import axios from 'axios';


const port = process.env.REACT_APP_PORTSV || 4001;
const fetchAllEmployees = async () => {
  try {
    const response = await axios.get(`http://localhost:${port}/api/employees`);
    const data = response.data;
    const list = Object.entries(data).map(([id, emp]) => ({ id, ...emp }));
    return list;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};
export { fetchAllEmployees };