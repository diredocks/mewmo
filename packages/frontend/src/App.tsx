import { Component } from "solid-js";
import { MemoInput } from "./components/MemoInput";
import { SearchBox } from "./components/SearchBox";
import ChevronDown from 'lucide-solid/icons/chevron-down';

const App: Component = () => {
  const handleSend = (text: string) => {
    console.log("send:", text);
  };

  return (
    <div class="bg-base-200">
      <div class="flex w-full max-w-240 mx-auto min-h-screen">
        <div class="flex-1 min-w-0 p-4 hidden lg:flex">
          To be filled...
        </div>

        <div class="flex-2 min-w-0 p-4 flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <button class="btn btn-ghost -translate-x-3 text-lg">
              🐱
              <ChevronDown size={16} />
            </button>
            <SearchBox />
          </div>
          <MemoInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
};

export default App;
