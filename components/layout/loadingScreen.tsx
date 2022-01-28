import { FC } from "react";
import Image from "next/image";
import { LoadingOutlined } from "@ant-design/icons";

interface Props {}

const LoadingScreen: FC<Props> = () => {
  return (
    <>
      <div
        style={{
          fontSize: 60,
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          flexWrap: "wrap",
        }}
      >
        <div style={{ alignItems: "center", display: "flex" }}>
          <Image
            className=""
            src={"/isu-logo.png"}
            width={80}
            height={80}
            alt="ISU Logo"
          />
          ISU
        </div>
        <LoadingOutlined />
      </div>
    </>
  );
};

export default LoadingScreen;
