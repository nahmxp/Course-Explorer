import '../styles/globals.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>Course Explorer</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 