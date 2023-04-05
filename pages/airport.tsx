import { NextPage } from 'next';
import { SWRConfig } from 'swr';
import Form from '../components/Form';
import Layout from '../components/Layout';
import { getAirportAPI } from '../fetch';

export type Country = {
  code: string;
  country: string;
  airports: string[];
};

type Props = {
  fallback: {
    countries: Country[];
  };
};

const Airport: NextPage<Props> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Layout>
        <Form />
      </Layout>
    </SWRConfig>
  );
};

export default Airport;

export async function getStaticProps() {
  const countries = await getAirportAPI();

  return {
    props: {
      fallback: {
        's3/airport': countries,
      },
    },
  };
}
