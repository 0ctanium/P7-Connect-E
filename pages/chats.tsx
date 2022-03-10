import {NextPage} from "next";
import {Layout} from "components/layout";

const Chats: NextPage = () => {
    return (
        <Layout current='chats'>
            <h1>Chats</h1>
        </Layout>
    )
}

Chats.auth = {}

export default Chats
