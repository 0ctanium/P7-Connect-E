import { ErrorLayout } from 'components/layout/errors/Layout';
import { NextPage } from 'next';

const ErrorPage: NextPage = () => {
  return (
    <ErrorLayout
      code={500}
      title="Erreur interne"
      message="Désolé, quelque chose ne s'est pas passé comme prévu."
    />
  );
};

export default ErrorPage;
