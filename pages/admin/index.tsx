import {AdminLayout} from "components/layout/Admin";
import { Role } from "constants/role";
import {NextPage} from "next";

const Admin: NextPage = () => {
  return (
      <AdminLayout title="Accueil" current="home">
        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
        </div>
      </AdminLayout>
  )
}


Admin.auth = {
    roles: [Role.ADMIN, Role.MODERATOR],
}
export default Admin
