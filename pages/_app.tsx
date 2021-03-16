import App from "next/app";
import { CSSReset } from "@chakra-ui/react";
import PageWithLayoutType from "@/types/pageWithLayout";
import theme from "../theme";
import { Chakra } from "../Chakra";
import { RootStoreProvider } from "../providers/RootStoreProvider";
import { Auth } from "@supabase/ui";
import { supabase } from "utils/initSupabase";
import "styles/supabase.css";

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
        <Auth.UserContextProvider supabaseClient={supabase}>
          <RootStoreProvider hydrationData={pageProps.hydrationData}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RootStoreProvider>
        </Auth.UserContextProvider>
      </Chakra>
    );
  }
}

export default MyApp;
