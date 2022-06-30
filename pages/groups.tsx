import { NextPage } from 'next';
import { Layout } from 'components/layout';

const Groups: NextPage = () => {
  return (
    <Layout current="groups" title="Groupes" showTitle>
      <h1>Groups</h1>
    </Layout>
  );
};

Groups.auth = {};

export default Groups;
