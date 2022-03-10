import {NextPage} from "next";
import {Layout} from "components/layout";

const Notifications: NextPage = () => {
    return (
        <Layout current='notifications'>
            <h1>Notifications</h1>
        </Layout>
    )
}

Notifications.auth = {}

export default Notifications
