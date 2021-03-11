import App, { AppContext } from "next/app";
import { CSSReset } from "@chakra-ui/react";
import PageWithLayoutType from "@/types/pageWithLayout";
import theme from "../theme";
import { Chakra } from "../Chakra";
import { Provider } from "mobx-react";
import { fetchInitialStoreState, DataStore } from "../stores/DataStore";

type AppLayoutProps = {
  Component: PageWithLayoutType;
  pageProps: any;
};

class MyApp extends App {
  state = {
    dataStore: new DataStore(),
  };

  // Fetching serialized(JSON) store state
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext);
    const initialStoreState = await fetchInitialStoreState();

    return {
      ...appProps,
      initialStoreState,
    };
  }

  // Hydrate serialized state to store
  static getDerivedStateFromProps(props, state) {
    state.dataStore.hydrate(props.initialStoreState);
    return state;
  }

  render() {
    const { Component, pageProps }: any = this.props;
    const Layout = Component.layout || ((children) => <>{children}</>);

    return (
      <Chakra theme={theme} cookies={pageProps.cookies}>
        <CSSReset />
        <Provider dataStore={this.state.dataStore}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Chakra>
    );
  }
}

export default MyApp;
