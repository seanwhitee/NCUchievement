import { Submission } from "@/lib/domain/entity/submission";
import { Button } from "../ui/button";
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item";
import { Spinner } from "../ui/spinner";

export const TryAgain = ({
  onClick,
}: {
  onClick: () => Promise<Submission[] | undefined>;
}) => {
  return (
    <div className="flex h-screen w-screen justify-center items-center flex-col gap-4 [--radius:1rem]">
      <Item variant="muted" className="w-full max-w-xs flex items-center">
        <ItemContent className="flex flex-col items-center text-center">
          <ItemTitle className="line-clamp-1 text-slate-500 text-xl whitespace-nowrap">
            No more pending submissions
          </ItemTitle>
          <Button className="mt-3 w-20" variant="outline" onClick={onClick}>
            Try again
          </Button>
        </ItemContent>
      </Item>
    </div>
  );
};
