import {AdminLayout} from "../../src/components/admin/Layout";

export default function Admin() {
  return (
      <AdminLayout title="Accueil" current="home">
        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
        </div>
      </AdminLayout>
  )
}
