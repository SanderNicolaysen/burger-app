import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-551d6-default-rtdb.firebaseio.com/'
});

export default instance;