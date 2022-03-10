import {NextPage} from "next";
import {Layout} from "components/layout";

const Profile: NextPage = () => {
    return (
        <Layout current='profile'>
            <h1>Profile</h1>
        </Layout>
    )
}

Profile.auth = {}

export default Profile
