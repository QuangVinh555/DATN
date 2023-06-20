import React, { useEffect } from 'react';
import "./MovieTheater.scss";
import { useDispatch, useSelector } from 'react-redux';
import { updatedChecked, updatedTitle } from '../../redux/global/GlobalSlice';
import Location from "../../components/movietheater/location/Location";
import CinemaName from "../../components/movietheater/cinemaName/CinemaName";
import CinemaRoom from "../../components/movietheater/cinemaRoom/CinemaRoom";
import ChairType from "../../components/movietheater/chairType/ChairType";
import Chair from "../../components/movietheater/chair/Chair";
import CinemaType from '../../components/movietheater/cinemaType/CinemaType';

const MovieTheater = () => {

  const listTitles = ["Vị trí", "Loại rạp", "Tên rạp", "Phòng chiếu"]

  const dispatch = useDispatch();

  // redux -> check title and checked show title
  const title = useSelector(state => state.global.title);
  const checked = useSelector(state => state.global.checked);

  const handleOpenTitle = (item) => {
    dispatch(updatedTitle(item))
    dispatch(updatedChecked(true))

  }

  useEffect(()=>{
    const checkElement = document.querySelector(".movietheater");
      if(checked) {
      checkElement.classList.remove("movietheater-container");
      }
      else{
        checkElement.classList.add("movietheater-container");

      }
  })

  return (
    <div className="movietheater">
      {
        !checked ?
        listTitles.map((item,index) => (
          <button 
            key = {index} 
            className="movietheater-btn"
            onClick={() => handleOpenTitle(item)}
          >
            {item}
          </button>
        ))
        
        : 

        (        
          (title === "Vị trí" && <Location />) ||
          (title === "Loại rạp" && <CinemaType />) ||
          (title === "Tên rạp" && <CinemaName />) ||
          (title === "Phòng chiếu" && <CinemaRoom />) ||
          (title === "Loại ghế" && <ChairType />) ||
          (title === "Ghế" && <Chair />)
        )
      }
    </div>
  )
}

export default MovieTheater