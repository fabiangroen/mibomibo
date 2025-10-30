import bier from "/bier.svg";
import Countdown from "./components/countdown";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center px-4">
      <div className="flex items-center gap-3 mb-2">
        <img src={bier} alt="Bier" className="w-10 h-10 sm:w-12 sm:h-12" />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-inter whitespace-nowrap">
          Mibo Countdown
        </h1>
      </div>
      <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8">
        Tijd tot de volgende mibo:
      </p>
      <Countdown />
    </div>
  );
}

export default App;
