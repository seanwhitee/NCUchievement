import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item";
import { Spinner } from "../ui/spinner";

export const Loading = () => {
  return (
    <div className="flex h-screen w-screen justify-center items-center flex-col gap-4 [--radius:1rem]">
      <Item variant="muted" className="w-full max-w-xs">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1 text-slate-500 text-xl">
            Loading ...
          </ItemTitle>
        </ItemContent>
      </Item>
    </div>
  );
};
