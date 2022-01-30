import type { NextPage } from "next";
import Head from "next/head";
import LoadingScreen from "components/layout/loadingScreen";
import { useAuthSession } from "utils/hooks";

const Home: NextPage = () => {
  const [user, loading, error] = useAuthSession();

  return (
    <div>
      <Head>
        <title>Faculty Workload</title>
        <meta
          name="description"
          content="This project was developed by BSCS Students from ISU Echague"
        />
        <link rel="icon" href="/isu-logo.ico" />
      </Head>
      <LoadingScreen />
    </div>
  );
};

export default Home;
