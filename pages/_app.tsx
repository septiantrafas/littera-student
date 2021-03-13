import App from "next/app";
import { CSSReset } from "@chakra-ui/react";
import PageWithLayoutType from "@/types/pageWithLayout";
import theme from "../theme";
import { Chakra } from "../Chakra";
import { RootStoreProvider } from "../providers/RootStoreProvider";

type AppLayoutProps = {
  Component: PageWithLayoutType;
  pageProps: any;
};

class MyApp extends App<AppLayoutProps> {
  render() {
    const { Component, pageProps } = this.props;
    const Layout = Component.layout || ((children) => <>{children}</>);

    return (
      <Chakra theme={theme} cookies={pageProps.cookies}>
        <CSSReset />
        <RootStoreProvider hydrationData={pageProps.hydrationData}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RootStoreProvider>
      </Chakra>
    );
  }
}

export default MyApp;
