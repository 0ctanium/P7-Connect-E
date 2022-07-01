import {
  AdminLayout,
  AdminLayoutHeader,
  AdminLayoutSection,
} from 'components/layout/Admin';
import { Role } from 'constants/role';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

const Admin: NextPage = () => {
  return (
    <AdminLayout current="home">
      <NextSeo
        title={`Dashboard - Groupomania`}
        description="Administrez le site Groupomania"
      />
      <AdminLayoutHeader title="Accueil" />
      <AdminLayoutSection>
        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
        </div>
      </AdminLayoutSection>
    </AdminLayout>
  );
};

Admin.auth = {
  roles: [Role.ADMIN, Role.MODERATOR],
};
export default Admin;
