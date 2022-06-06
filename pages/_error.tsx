import {ErrorLayout} from "components/layout/errors/Layout";
import {NextPage} from "next";

interface ErrorProps {
  statusCode?: number
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
  return <ErrorLayout
      code={statusCode || 500}
      title="Erreur interne"
      message="Désolé, quelque chose ne s'est pas passé comme prévu."
  />
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  return { statusCode }
}

export default ErrorPage
