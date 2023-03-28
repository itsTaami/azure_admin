import axios from 'axios';
import { createContext, React, useState } from 'react';

export const CategoryContext = createContext();

const CategoryProvider = ({ children }) => {
  const [categories, setCategory] = useState([]);

  const [fileteredCategory, setFilteredCategory] = useState([]);

  const [catData, setCatData] = useState({});

  const { _id } = catData;

  const getCategory = () => {
    axios
      .get('http://localhost:8000/categories')
      .then((res) => {
        console.log('CAT IRLEE', res.data.category);
        setCategory(res.data.category);
        setFilteredCategory(res.data.category);
      })
      .catch((err) => {
        console.log('Err', err);
      });
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        setCategory,
        fileteredCategory,
        setFilteredCategory,
        getCategory,
        catData,
        setCatData,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
