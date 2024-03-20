const RollTimerService = () => {
    let rollingTime = 15;
    let timer: any;
  
    const startTimer = (setRollingTime: any) => {
      timer = setInterval(() => {
        if (rollingTime > 0) {
          setRollingTime(rollingTime - 1);
        }
      }, 1000);
    };
  
    const stopTimer = () => {
      clearInterval(timer);
    };
  
    const resetTimer = () => {
      clearInterval(timer);
      rollingTime = 15;
    };
  
    return {
      startTimer,
      stopTimer,
      resetTimer,
    };
  };
  
  export default RollTimerService;
  