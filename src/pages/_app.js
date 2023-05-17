import { useEffect, useState } from 'react';
import '../styles/globals.css'
import ThemeProvider from '../theme';
import ScrollToTop from '../components/scroll-to-top';
import Loader from 'src/components/Loader';
import Router from 'next/router'

function App({ Component, pageProps }) {
  const [openLoader, setOpenLoader] = useState(false);
  useEffect(() => {
    Router.events.on('routeChangeStart', () => setOpenLoader(true));
    Router.events.on('routeChangeError', () => setOpenLoader(false));
    Router.events.on('routeChangeComplete', () => setOpenLoader(false));

    return () => {
      Router.events.off('routeChangeStart', () => setOpenLoader(true));
      Router.events.off('routeChangeError', () => setOpenLoader(false));
      Router.events.off('routeChangeComplete', () => setOpenLoader(false));
    };
  }, []);

  return (
  <>
      <ThemeProvider>
          <ScrollToTop />
          <Component {...pageProps} />
          <Loader open={openLoader} />
      </ThemeProvider>
  </>
  )
}



export default App