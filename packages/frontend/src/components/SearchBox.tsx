import ListFilter from "lucide-solid/icons/list-filter";
import Search from "lucide-solid/icons/search";
import { Component, JSX } from "solid-js";

type SearchBoxProps = {
  value?: string;
  placeholder?: string;
  onInput?: JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;
};

export const SearchBox: Component<SearchBoxProps> = (props) => {
  return (
    <div class="flex w-2/5 justify-end transition-all">
      <label class="input group w-full rounded-full border-0 bg-neutral-200 shadow-none outline-none">
        <span class="opacity-50 transition-opacity hover:cursor-pointer hover:opacity-80 group-focus-within:opacity-80">
          <Search size={16} />
        </span>

        <input
          type="input"
          value={props.value ?? ""}
          placeholder={props.placeholder ?? "Ctrl+K"}
          onInput={props.onInput}
          class="opacity-60 focus-within:opacity-100"
        />

        <span class="opacity-50 transition-opacity hover:cursor-pointer hover:opacity-80 group-focus-within:opacity-80">
          <ListFilter size={16} />
        </span>
      </label>
    </div>
  );
};
