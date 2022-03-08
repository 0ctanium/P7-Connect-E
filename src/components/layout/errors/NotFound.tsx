import React, {FC} from 'react'
import {ErrorLayout} from "./Layout";

export const NotFoundErrorPage: FC = () => {
    return <ErrorLayout
        code={404}
        title="Page introuvable"
        message="Désolé, nous n'avons pas pu trouver la page que vous cherchez."
        label="Retourner à l'application"
        redirect="/"
    />
}
