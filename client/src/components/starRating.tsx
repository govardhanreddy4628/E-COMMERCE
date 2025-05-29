import { useState } from "react";

export default function StarRating() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const stars = Array(5).fill("*");

  const handleClick = (i:number) => {
    setRating(i + 1);
  };

  const handleMouseOver = (i:number) => {
    setHover(i + 1);
  };

  return (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"50px", width:"100%"}}>
      <div style={{width:"auto", height:"auto"}}>
      {stars.map((el, i) => (
        <div
          key={i}
          style={{
          
            display:"inline-block",
            
          }}
        >
          <div
            className={
              i<(rating&&hover ) || i<hover 
                ? "active"
                : "coloring"
            }
            onClick={() => {handleClick(i)}}
            onMouseOver={() => {handleMouseOver(i)}}
            onMouseLeave={()=>setHover(rating)}
            style={{fontSize:"25px"}}
          >
            &#x2605;
          </div>
        </div>
      ))}
      </div>
      
    </div>
  );
}
