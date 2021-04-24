import App from "next/app";
import { CSSReset } from "@chakra-ui/react";
import PageWithLayoutType from "@/types/pageWithLayout";
import theme from "../theme";
import { Chakra } from "../Chakra";
import { CypressStoreProvider } from "providers/CypressStoreProvider";
import { RootStoreProvider } from "../providers/RootStoreProvider";
import { Auth } from "@supabase/ui";
import { supabase } from "utils/initSupabase";
import NProgress from "nprogress";
import Router from "next/router";
import Head from "next/head";

import "styles/supabase.css";
import "styles/globals.css";

type AppLayoutProps = {
  Component: PageWithLayoutType;
  pageProps: any;
};

Router.events.on("routeChangeStart", (url) => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => NProgress.done());

Router.events.on("routeChangeError", () => NProgress.done());

class MyApp extends App<AppLayoutProps> {
  render() {
    const { Component, pageProps } = this.props;
    const Layout = Component.layout || ((children) => <>{children}</>);

    return (
      <>
        <Chakra theme={theme} cookies={pageProps.cookies}>
          <CSSReset />
          <Auth.UserContextProvider supabaseClient={supabase}>
            <RootStoreProvider hydrationData={pageProps.hydrationData}>
              <CypressStoreProvider />
              <Head>
                {/* Import CSS for nprogress */}
                <link rel="stylesheet" type="text/css" href="/nprogress.css" />
              </Head>
              {!Component.layout ? (
                <Component {...pageProps} />
              ) : (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              )}
            </RootStoreProvider>
          </Auth.UserContextProvider>
        </Chakra>
      </>
    );
  }
}

export default MyApp;
