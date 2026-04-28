import { useState, useEffect } from "react";

const CountDownTimer = ({ hoursMinSecs, quizEnd }) => {
  const { hours = 0, minutes = 0, seconds = 60 } = hoursMinSecs;
  const [[hrs, mins, secs], setTime] = useState([hours, minutes, seconds]);

  const tick = () => {
    if (hrs === 0 && mins === 0 && secs === 0) reset();
    else if (mins === 0 && secs === 0) {
      setTime([hrs - 1, 59, 59]);
    } else if (secs === 0) {
      setTime([hrs, mins - 1, 59]);
    } else {
      setTime([hrs, mins, secs - 1]);
    }
  };

  let timerId;
  const reset = () => {
    clearInterval(timerId);
    quizEnd();
    window.location.reload()
    //setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);
  };

  useEffect(() => {
    timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  return (
    <p className="count text-xl sm:text-2xl font-extrabold tabular-nums tracking-tight text-slate-800">
      <span className="mr-0.5">{`${mins.toString().padStart(2, "0")}`}</span>:
      <span className="ml-0.5">{`${secs.toString().padStart(2, "0")}`}</span>
    </p>
  );
};

export default CountDownTimer;
