import axios from "axios";
import React from "react";

type Props = { helloworld: string };

const IndexPage = ({ helloworld }: Props) => {
  return <h1>{helloworld}</h1>;
};

export async function getServerSideProps() {
  // string "Hello From Backend API" will be fetched.
  const { data } = await axios.get(
    `${process.env.FRONT_API_ENDPOINT_SERVER}/helloworld`
  );

  return {
    props: { helloworld: data },
  };
}

export default IndexPage;
