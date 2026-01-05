import { useQuery } from "@tanstack/react-query";

import { booksOptions } from "@/options/bible.options";

export const useBibleBooks = () => useQuery(booksOptions());
