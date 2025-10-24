import axios from 'axios';
export async function getclientip(ip){
    const response = await axios.get(`https://ipapi.co/${ip}/json/`)
    console.log(response);
    return response.data
}
