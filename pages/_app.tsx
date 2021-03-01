import { CSSReset } from "@chakra-ui/react";
import PageWithLayoutType from "../types/pageWithLayout";
import theme from "../theme";
import { Chakra } from "../Chakra";

type AppLayoutProps = {
  Component: PageWithLayoutType;
  pageProps: any;
};

function MyApp({ Component, pageProps }: AppLayoutProps) {
  const Layout = Component.layout || ((children) => <>{children}</>);
  return (
    <Chakra theme={theme} cookies={pageProps.cookies}>
      <CSSReset />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Chakra>
  );
}

export default MyApp;
