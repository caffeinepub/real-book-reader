import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Book } from "../backend.d";
import { useActor } from "./useActor";

const BOOK_TITLE = "Thirty Days Complete Course";

export function useGetBook() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  return useQuery<Book | null>({
    queryKey: ["book", BOOK_TITLE],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const book = await actor.getBook(BOOK_TITLE);
        return book;
      } catch {
        try {
          await actor.initializeBook(BOOK_TITLE, "", BigInt(60));
          queryClient.invalidateQueries({ queryKey: ["book", BOOK_TITLE] });
          return { title: BOOK_TITLE, author: "", totalPages: BigInt(60) };
        } catch {
          return { title: BOOK_TITLE, author: "", totalPages: BigInt(60) };
        }
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}
