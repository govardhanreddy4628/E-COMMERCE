import { useEffect, useState } from 'react'

const Counter = () => {
    // State for the counter value
    const [count, setCount] = useState<number>(0);
  
    // State to track if the timer is running or paused
    const [isRunning, setIsRunning] = useState<boolean>(false);
    
    // Use useEffect to handle the interval when isRunning is true
    useEffect(() => {
      let interval: ReturnType<typeof setInterval> | undefined;
  
      if (isRunning) {
        
        interval = setInterval(() => {
          setCount((prevCount) => prevCount + 1);
          console.log("hello")
        }, 1000);
      } else {
        // Clear the interval when paused
        clearInterval(interval);
        console.log("good")
      }
      return () => {clearInterval(interval)
        console.log("happy")
      };
    }, [isRunning]); // This effect runs when isRunning changes
  
    
    const startTimer = () => setIsRunning(true);
    const pauseTimer = () => setIsRunning(false);
    const resetTimer = () => {
      setCount(0);
      setIsRunning(false); 
    };
  
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1 className='text-4xl text-green-200'>Counter: {count}</h1>
        
        <div>
          <button onClick={startTimer} disabled={isRunning}>
            Start
          </button>
          <button className="p-4" onClick={pauseTimer} disabled={!isRunning}>
            Pause
          </button>
          <button onClick={resetTimer}>
            Reset
          </button>
        </div>
        <div>
          
        </div>
      </div>
    );
}

export default Counter
