import type { NextPage } from "next";
import Head from "next/head";
import LoadingScreen from "components/layout/loadingScreen";
import { useRouter } from "next/router";
import { useAuthSession } from "utils/hooks";

interface indexProps {}

const Home: NextPage = ({}) => {
  const { user, loading, error } = useAuthSession();

  return (
    <div>
      <Head>
        <title>Faculty Workload</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingScreen />
    </div>
  );
};

export default Home;
