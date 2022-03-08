import React, {FC} from 'react'
import {ErrorLayout} from "./Layout";

export const UnauthorizedErrorPage: FC = () => {
    return <ErrorLayout
        code={403}
        title="Accès interdit"
        message="Désolé, vous n'êtes pas autorisé à accéder cette page.\nSi vous devriez y avoir accès, veuillez contacter un administrateur."
        label="Retourner à l'application"
        redirect="/"
    />
}
