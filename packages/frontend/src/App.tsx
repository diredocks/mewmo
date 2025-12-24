import ChevronDown from "lucide-solid/icons/chevron-down";
import { Component } from "solid-js";
import { MemoInput } from "./components/MemoInput";
import { SearchBox } from "./components/SearchBox";

const App: Component = () => {
  const handleSend = (text: string) => {
    console.log("send:", text);
  };

  return (
    <div class="bg-base-200">
      <div class="mx-auto flex min-h-screen w-full max-w-240">
        <div class="hidden min-w-0 flex-1 p-4 lg:flex">To be filled...</div>

        <div class="flex min-w-0 flex-2 flex-col gap-3 p-4">
          <div class="flex items-center justify-between">
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
