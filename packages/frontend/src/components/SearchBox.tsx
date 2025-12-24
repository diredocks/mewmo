import { Component, JSX } from "solid-js";
import ListFilter from 'lucide-solid/icons/list-filter';
import Search from 'lucide-solid/icons/search';

type SearchBoxProps = {
  value?: string;
  placeholder?: string;
  onInput?: JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;
};

export const SearchBox: Component<SearchBoxProps> = (props) => {
  return (
    <div class="flex justify-end w-2/5 transition-all">
      <label class="input rounded-full w-full bg-neutral-200 group 
        border-0 shadow-none outline-none ">
        <span
          class="
        opacity-50
        transition-opacity
        group-focus-within:opacity-80
        hover:opacity-80
        hover:cursor-pointer">
          <Search size={16} />
        </span>

        <input
          type="input"
          value={props.value ?? ""}
          placeholder={props.placeholder ?? "Ctrl+K"}
          onInput={props.onInput}
          class="opacity-60 focus-within:opacity-100" />

        <span class="opacity-50 transition-opacity
        group-focus-within:opacity-80
        hover:opacity-80
        hover:cursor-pointer">
          <ListFilter size={16} />
        </span>
      </label>
    </div>

  );
};