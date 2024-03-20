import Page from "../components/Page";
import nProgress from "nprogress";
import Router from "next/router";
import "../components/styles/nprogress.css";
import { ApolloProvider } from "@apollo/client";
import createApolloClient from "../apollo-client";
import { CartStateProvider } from "../lib/cartState";

Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());

export default function MyApp({ Component, pageProps }) {
  const client = createApolloClient();
  return (
    <ApolloProvider client={client}>
      <CartStateProvider>
        <Page>
          <Component {...pageProps} />
        </Page>
      </CartStateProvider>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  pageProps.query = ctx.query;
  return { pageProps };
}
