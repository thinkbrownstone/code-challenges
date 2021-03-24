import axios from "axios";

const getAxiosData = (urlInput, setData) => {
 
  const getData = async (url) => {
    try {
      
      const { data } = await axios.get(urlInput);
      if (data) {
        // console.log('getAxiosData data =', data);
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
// console.log('getAxiosData url = ', urlInput);
  getData(urlInput);
};
export default getAxiosData;
