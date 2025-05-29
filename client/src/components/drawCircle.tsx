import React, { useEffect, useState } from 'react'
import {Routes, Route } from "react-router-dom";
import { useLocation } from 'react-router-dom';



interface CircleCoordinates{
    top: number;
    left: number;
    bottom: number;
    right: number;
    background: string;
}

const RADIUS : number = 50;
const DrawCircle:React.FC = () => {
    const [circleCoordinates, setCircleCoordinates] = useState<CircleCoordinates[]>([]);

    const location = useLocation()

    useEffect(()=>{
        const drawCircle = (e:MouseEvent) => {
            const {clientX, clientY} = e;

            const newCircleCoordinates : CircleCoordinates = {
                top : clientY - RADIUS,
                left : clientX - RADIUS,
                bottom: clientY + RADIUS,
                right: clientX + RADIUS,
                background: "red"
            };

            //setCircleCoordinates([...circleCoordinates, newCircleCoordinates])
            setCircleCoordinates((prevState) => {
                for(let i=0; i<prevState.length; i++){
                    const collides = ElementsOverlap(newCircleCoordinates, prevState[i]);
                    if(collides){
                        newCircleCoordinates.background = "green";
                        break;
                    }
                }

                return [...prevState, newCircleCoordinates];
            })
        }

        const ElementsOverlap = (circle1, circle2) => {
            const collides = !(circle1.top > circle2.bottom || circle1.right < circle2.left || circle1.bottom < circle2.top || circle1.left > circle2.right)
            return collides
        }
        document.addEventListener("click", drawCircle);
        return () => document.removeEventListener("click", drawCircle)
    },[])

    console.log(circleCoordinates);
    console.log(location.pathname)

    
  return (
    <div>
        <Routes>
            <Route path='/' element={<Dr2/>}></Route>
            <Route path='/dr' element={<Dr3/>}></Route>
        </Routes>
      it is draw circle component
      {circleCoordinates.map((e) => <Circle {...e} key={e.top + e.left + e.bottom}/>)}
    </div>
  )
}


interface circleProps{
    top : number;
    left : number;
    background : string;
}

const Circle : React.FC <circleProps>= ({top, left, background}) => {
    return(
        <div style={{position:'absolute', width: RADIUS*2, height: RADIUS*2, borderRadius:"50%", top, left, background}}></div>
    )
}
export default DrawCircle;
 





// import React, { useEffect, useState } from 'react';

// interface CircleProps {
//   top: number;
//   left: number;
//   background: string;
// }

// const DrawCircle: React.FC = () => {
//   const [circles, setCircles] = useState<CircleProps[]>([]);
//   const RADIUS = 50;

//   useEffect(() => {
//     const drawCircle = (e: MouseEvent) => {
//       const { clientX, clientY } = e;
//       setCircles(prev => [
//         ...prev,
//         {
//           top: clientY - RADIUS,
//           left: clientX - RADIUS,
//           background: 'red',
//         },
//       ]);
//     };

//     document.addEventListener('click', drawCircle);
//     return () => document.removeEventListener('click', drawCircle);
//   }, []);

//   return (
//     <div>
//       {circles.map((circle, index) => (
//         <div
//           key={index}
//           style={{
//             position: 'absolute',
//             width: RADIUS * 2,
//             height: RADIUS * 2,
//             borderRadius: '50%',
//             top: circle.top,
//             left: circle.left,
//             background: circle.background,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default DrawCircle;





 
