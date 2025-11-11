import { useEffect, useState } from 'react'

const Counter = () => {

  const [count, setCount] = useState<number>(0);
  //const [isRunning, setIsRunning] = useState<boolean>(false);

  // useEffect(() => {
  //   let interval: ReturnType<typeof setInterval> | undefined;

  //   if (isRunning) {
  //     interval = setInterval(() => {
  //       setCount((prevCount) => prevCount + 1);
  //       console.log("hello")
  //     }, 1000);
  //   } else {
  //     // Clear the interval when paused
  //     clearInterval(interval);
  //     console.log("good")
  //   }
  //   return () => {
  //     clearInterval(interval)
  //     console.log("happy")
  //   };
  // }, [isRunning]);


  // const startTimer = () => setIsRunning(true);
  // const pauseTimer = () => setIsRunning(false);
  // const resetTimer = () => {
  //   setCount(0);
  //   setIsRunning(false);
  // };

  useEffect(() => {
    setInterval(() => setCount(count+1))
  }, [])

  const startTimer = () => {}
  const pauseTimer = () => {}
  const resetTimer = () => { setCount(0) };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 className='text-4xl text-green-200'>Counter: {count}</h1>
      <div>
        <button onClick={startTimer} >Start</button>
        <button className="p-4" onClick={pauseTimer} >Pause</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}

export default Counter
