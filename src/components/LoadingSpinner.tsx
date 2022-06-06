import {FC, HTMLAttributes} from 'react'
import {Spinner} from "../icons/Spinner";

export const LoadingSpinner: FC<HTMLAttributes<HTMLOrSVGElement>> = ({ className = "h-8 w-8", ...props }) => {
    return <Spinner {...props} className={"mx-auto text-gray-800 animate-spin " + className} />;
}
