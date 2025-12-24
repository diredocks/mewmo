import AtSign from "lucide-solid/icons/at-sign";
import HashIcon from "lucide-solid/icons/hash";
import Send from "lucide-solid/icons/send-horizontal";
import { Component, createSignal } from "solid-js";

interface MemoInputProps {
  placeholder?: string;
  onSend?: (value: string) => void;
}

export const MemoInput: Component<MemoInputProps> = (props) => {
  const [value, setValue] = createSignal("");

  const send = () => {
    const text = value().trim();
    if (!text) return;

    props.onSend?.(text);
    setValue("");
  };

  return (
    <div class="card group bg-base-100 shadow-sm ring-1 ring-base-300 transition-all focus-within:shadow-md">
      <div class="card-body gap-2 rounded-sm p-2 ring-0 transition-all group-focus-within:ring-2 group-focus-within:ring-accent">
        {/* textarea */}
        <textarea
          class="textarea textarea-ghost w-full resize-none px-1.5 py-1 outline-none"
          placeholder={props.placeholder ?? "I've been thinking of..."}
          value={value()}
          onInput={(e) => setValue(e.currentTarget.value)}
        />

        <div class="flex items-center justify-between p-1">
          {/* left buttons */}
          <div class="join">
            <button class="btn btn-xs join-item btn-ghost px-1 text-gray-300 transition-colors group-focus-within:text-gray-500">
              <HashIcon size={16} />
            </button>

            <button class="btn btn-xs join-item btn-ghost px-1 text-gray-300 transition-colors group-focus-within:text-gray-500">
              <AtSign size={16} />
            </button>
          </div>

          <button
            class="btn btn-xs transition-colors disabled:opacity-100"
            classList={{
              "btn-accent": value().length > 0,
            }}
            disabled={!value().length}
            onClick={send}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
