import "antd/dist/antd.css";
import "styles/globals.css";
import type { AppProps } from "next/app";
import { WorkloadProvider } from "context/workloadContext";
import { ActiveComponentProvider } from "context/activeComponentContext";
import WorkloadHeader from "components/workload/workloadHeader";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ActiveComponentProvider>
      <WorkloadProvider>
        <Component {...pageProps} />
      </WorkloadProvider>
    </ActiveComponentProvider>
  );
}

export default MyApp;
