import React, {FC} from 'react'

export const TableStateFooter: FC<{ loading: boolean, error?: any, data: any[] }> = ({ loading, error, data}) => {
    if(loading) {
        return (
            <td colSpan={10000} className="py-4 px-6 whitespace-nowrap">
                Chargement...
            </td>
        )
    }

    if(error) {
        return (
            <td
                colSpan={10000}
                className="py-4 px-6 text-red-400 whitespace-nowrap">
                Erreur...
            </td>
        )
    }

    if(data.length === 0) {
        return (
            <td
                colSpan={10000}
                className="py-4 px-6 text-gray-600 whitespace-nowrap">
                Aucune entrée à afficher...
            </td>
        )
    }

    return null
}
