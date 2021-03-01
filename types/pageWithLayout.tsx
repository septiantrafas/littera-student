import { NextPage } from "next";
import Default from "@/layouts/default";
import Authenticated from "@/layouts/authenticated";

type PageWithDefaultLayoutType = NextPage & { layout: typeof Default };
type PageWithAuthenticatedLayoutType = NextPage & {
  layout: typeof Authenticated;
};

type PageWithLayoutType =
  | PageWithDefaultLayoutType
  | PageWithAuthenticatedLayoutType;

export default PageWithLayoutType;
