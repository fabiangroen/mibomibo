import bier from "/bier.svg";
import Countdown from "./components/countdown";
import BeerIcon from "./components/beer-icon";
import CursorOverlay from "./components/cursorOverlay";
import NameChange from "./components/nameChange";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <CursorOverlay />
      <NameChange />
      <div className="flex items-center gap-3 mb-2 z-10">
        <BeerIcon
          src={bier}
          alt="Bier"
          className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer"
        />
        <p className="text-4xl sm:text-5xl font-extrabold tracking-tight font-inter whitespace-nowrap">
          Mibo Countdown
        </p>
      </div>
      <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 z-10">
        Tijd tot de volgende mibo:
      </p>
      <div className="z-10">
        <Countdown />
      </div>
    </div>
  );
}

export default App;
