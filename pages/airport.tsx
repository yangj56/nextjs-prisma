import { NextPage } from 'next';
import Form from '../components/Form';
import Layout from '../components/Layout';

export type Country = {
  code: string;
  country: string;
  airports: string[];
};

type Props = {
  countries: Country[];
};

const Airport: NextPage<Props> = ({ countries }) => {
  return (
    <Layout>
      <Form countries={countries} />
    </Layout>
  );
};

export default Airport;

export async function getStaticProps() {
  const airportJSON = await fetch(`${process.env.JSON_URL}`);
  const countries = await airportJSON.json();

  return {
    props: { countries },
  };
}
