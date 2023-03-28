import { React, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import { CategoryContext } from '../../context/Category';

const style = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  //   height: '60%',
  bgcolor: 'background.paper',
  border: '1px solid grey',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
};

export default function CategoryModal({
  isModal,
  // catData,
  // setCatData,
  modalToggle,
  isSubmit,
  setIsSubmit,
  newCategory,
}) {
  const [newCategoryObj, setNewCategoryObj] = React.useState({
    title: '',
    description: '',
    categoryImg: 'url',
    categoryRating: '',
  });

  const { categories, fileteredCategory, getCategory, catData, setCatData } = useContext(CategoryContext);

  const changeHandler = (e) => {
    if (newCategory) {
      setNewCategoryObj({ ...newCategoryObj, [e.target.name]: e.target.value });
    } else {
      setCatData({ ...catData, [e.target.name]: e.target.value });
    } // catData,
    // setCatData,
  };

  const toggleSubmit = () => {
    // catData,
    // setCatData,
    console.log(isSubmit);
    setIsSubmit(!isSubmit);
  };

  const updateCategory = async () => {
    try {
      const res = await axios.put('http://localhost:8000/categories', catData);
      modalToggle();
    } catch (error) {
      console.log('UC', error);
    }
  };

  const addCategory = async () => {
    try {
      const res = await axios.post('http://localhost:8000/categories', newCategoryObj);
      modalToggle();
    } catch (error) {
      console.log('AC', error);
    }
  };

  const handleClose = () => modalToggle();

  return (
    <Box>
      <Modal
        open={isModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h3">{newCategory ? 'Шинэ' : ' Өөрчлөх'} категори</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', width: '100%' }}>
            <TextField
              id="outlined-basic"
              label="Title"
              variant="outlined"
              name="title"
              value={newCategory ? newCategoryObj.title : catData.title}
              onChange={changeHandler}
            />
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              name="description"
              value={newCategory ? newCategoryObj.description : catData.description}
              onChange={changeHandler}
            />
            <TextField
              id="outlined-basic"
              label="Image"
              variant="outlined"
              type="file"
              name="categoryImg"
              onChange={async (e) => {
                console.log(e.target.files[0]);
                const imgData = new FormData();
                imgData.append('image', e.target.files[0]);
                const res = await axios.post('http://localhost:8000/upload', imgData);
                console.log(res.data.imgUrl);
                setNewCategoryObj({ ...newCategoryObj, categoryImg: res.data.imgUrl });
              }}
            />
            <TextField
              id="outlined-basic"
              label="Rating"
              variant="outlined"
              type="number"
              name="categoryRating"
              value={newCategory ? newCategoryObj.categoryRating : catData.categoryRating}
              onChange={changeHandler}
            />
            <Button
              onClick={() => {
                if (newCategory) {
                  addCategory();
                } else {
                  updateCategory();
                }
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import { TextField } from '@mui/material';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '40%',
//   height: '80%',
//   bgcolor: 'background.paper',
//   border: '1px solid grey',
//   borderRadius: '20px',
//   boxShadow: 24,
//   p: 4,
// };

// export default function BasicModal({ icon, name, title, description, categoryImg, categoryRating }) {
//   const [open, setOpen] = React.useState(false);

//   const [iconName, setIconName] = React.useState('');

//   const [titleChange, setTitleChange] = React.useState(title);

//   const [descriptionChange, setDescriptionChange] = React.useState(description);

//   const [imgChange, setImgChange] = React.useState(categoryImg);

//   const [ratingChange, setRatingChange] = React.useState(categoryRating);

//   const form = '';
//   const formData = [
//     { value: title, label: 'title', change: titleChange },
//     { value: description, label: 'description', change: descriptionChange },
//     { value: categoryImg, label: 'Image', change: imgChange },
//     { value: categoryRating, label: 'Rating', change: ratingChange },
//   ];

//   const handleChange = (event) => {
//     console.log(event.target);
//     console.log(event.target.value);
//     setRatingChange(event.target.value);
//   };

//   const handleOpen = (e) => {
//     setOpen(true);
//     setIconName(e);
//   };
//   //   if(iconName=="Delete"){
//   //     form=
//   //   }

//   const handleClose = () => setOpen(false);

//   return (
//     <div>
//       <Button onClick={() => handleOpen(name)}>{icon}</Button>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', width: '100%' }}>
//             {formData.map((e, index) => (
//               <TextField
//                 key={index}
//                 id="outlined-basic"
//                 label={e.label}
//                 variant="outlined"
//                 value={e.change}
//                 onChange={handleChange}
//               />
//             ))}
//           </Box>
//           <Button>Submit</Button>
//         </Box>
//       </Modal>
//     </div>
//   );
// }
