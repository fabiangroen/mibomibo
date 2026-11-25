import { useEffect, useState } from "react";
import bier from "/bier.svg";
import Countdown from "./components/countdown";
import { getTimeLeft, isMiboTime } from "./lib/mibo";
import BeerIcon from "./components/beer-icon";

const pad = (n: number) => String(n).padStart(2, "0");

function App() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const miboTime = isMiboTime(now);
  const timeLeft = getTimeLeft(now);
  const finalMinute = timeLeft.hours === 0 && timeLeft.minutes === 0;

  useEffect(() => {
    document.title = miboTime
      ? "Het is mibo tijd!"
      : `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)} - Mibo`;
  }, [miboTime, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]);

  return (
    <main
      className={`min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden transition-colors duration-700 ${
        miboTime
          ? "bg-thalia"
          : "bg-[radial-gradient(ellipse_at_center,rgba(230,34,114,0.18),transparent_65%)]"
      }`}
    >
      {(miboTime || !finalMinute) && (
        <>
          <div className="flex items-center gap-3 mb-2">
            <BeerIcon src={bier} alt="Bier" className="w-10 h-10 sm:w-12 sm:h-12" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight whitespace-nowrap">
              Mibo Countdown
            </h1>
          </div>
          {!miboTime && (
            <p className="text-base sm:text-lg text-thalia-light mb-6 sm:mb-8">
              Tijd tot de volgende mibo:
            </p>
          )}
        </>
      )}
      <Countdown timeLeft={timeLeft} miboTime={miboTime} />
    </main>
  );
}

export default App;
