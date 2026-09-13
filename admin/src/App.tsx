import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Sectors from "./pages/Sectors";
import Entities from "./pages/Entities";
import Governorates from "./pages/Governorates";
import Categories from "./pages/Categories";
import Sources from "./pages/Sources";

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="sectors" element={<Sectors />} />
        <Route path="entities" element={<Entities />} />
        <Route path="governorates" element={<Governorates />} />
        <Route path="categories" element={<Categories />} />
        <Route path="sources" element={<Sources />} />
      </Route>
    </Routes>
  );
}
