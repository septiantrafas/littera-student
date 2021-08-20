import { NextComponentType } from "next";
import { AppContext, AppInitialProps } from "next/app";

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

import "focus-visible/dist/focus-visible";
import "styles/supabase.css";
import "styles/globals.css";
import { useEffect } from "react";

type AppLayoutProps = {
  Component: PageWithLayoutType;
  pageProps: any;
};

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => NProgress.done());

Router.events.on("routeChangeError", () => NProgress.done());

const MyApp: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = (
  props
) => {
  const { Component, pageProps } = props;
  const Layout = Component.layout || ((children) => <>{children}</>);

  return (
    <>
      <Chakra theme={theme} cookies={pageProps.cookies}>
        <CSSReset />
        <Auth.UserContextProvider supabaseClient={supabase}>
          <RootStoreProvider hydrationData={pageProps.hydrationData}>
            <CypressStoreProvider />
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
};

export default MyApp;
