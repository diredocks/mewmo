import { Component, createSignal } from "solid-js";
import { At, HashTag, Send } from "./Icons";

interface MemoInputProps {
  placeholder?: string;
  onSend?: (value: string) => void;
}

export const MemoInput: Component<MemoInputProps> = (props) => {
  const [value, setValue] = createSignal("");
  const [focused, setFocused] = createSignal(false);

  const send = () => {
    const text = value().trim();
    if (!text) return;

    props.onSend?.(text);
    setValue("");
  };

  return (
    <div class="card bg-base-100 ring-1 ring-base-300 transition-all"
      classList={{
        "shadow-md": focused(),
        "shadow-sm": !focused(),
      }}>
      <div class="card-body gap-2 p-2"
        classList={{
          "ring-accent ring-2 rounded-sm": focused(),
          "ring-0": !focused(),
        }}>
        <textarea
          class="textarea textarea-ghost w-full py-1 px-1.5 outline-0 resize-none"
          placeholder={props.placeholder ?? "I've been thinking of..."}
          value={value()}
          onInput={(e) => setValue(e.currentTarget.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <div class="flex items-center justify-between p-1">
          <div class="join">
            <button class="btn btn-xs join-item px-1"
              classList={{
                "text-gray-500": focused(),
                "btn-ghost text-gray-300": !focused()
              }}>
              <HashTag />
            </button>
            <button class="btn btn-xs join-item px-1"
              classList={{
                "text-gray-500": focused(),
                "btn-ghost text-gray-300": !focused()
              }}>
              <At />
            </button>
          </div>
          <button
            class="btn btn-xs"
            classList={{
              "btn-accent": !!value().length,
              "text-gray-300": !!!value().length
            }}
            onClick={send}
          >
            <Send />
          </button>
        </div>
      </div>
    </div >
  );
};
