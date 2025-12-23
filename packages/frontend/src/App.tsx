import { Component } from "solid-js";
import { MemoInput } from "./components/MemoInput";

const App: Component = () => {
  const handleSend = (text: string) => {
    console.log("send:", text);
  };

  return (
    <div class="bg-base-200">
      <div
        class="flex w-full max-w-240 mx-auto min-h-screen"
      >
        <div class="flex-1 min-w-0 p-4 hidden lg:flex">
          To be filled...
        </div>

        <div class="flex-2 min-w-0 p-4">
          <MemoInput onSend={handleSend} />
        </div>
      </div>
    </div>

  );
};

export default App;
