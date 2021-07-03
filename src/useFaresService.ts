import { useEffect, useState } from 'react';
import { FaresData, Service } from './types';

const useFaresService = () => {
  const [data, setData] = useState<Service<FaresData>>({
    status: 'loading'
  });

  useEffect(() => {
    const fetchFares = async () => {
      const url = "https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json";
      await fetch(url)
      .then(response => response.json())
      .then(response => setData({ status: 'loaded', payload: response }))
      .catch(error => setData({ status: 'error', error }));;
    }
    fetchFares()
  }, [])

  return data;
};

export default useFaresService;