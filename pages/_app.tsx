import { TransferProvider } from "../components/context/TransferContext";
import "../global.css";

function MyApp({ Component, pageProps }) {
  return (
    <TransferProvider>
      <Component {...pageProps} />
    </TransferProvider>
  );
}

export default MyApp;
