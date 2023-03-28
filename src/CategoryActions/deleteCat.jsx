const deleteCat = ({ _id, toggleSubmit }) => {
  axios
    .delete(`http://localhost:8000/categories/${_id}`)
    .then((res) => {
      console.log('res', res);
      // toggleSubmit();
    })
    .catch((err) => {
      console.log('Err', err);
    });
};

export default deleteCat;
