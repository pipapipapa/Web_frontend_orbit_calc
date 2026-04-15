import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import { OrbitsPage } from "./pages/Orbits";
import { OrbitPage } from "./pages/OrbitPage";
import { MissionPage } from "./pages/MissionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<OrbitsPage />} />
        <Route path={`${ROUTES.ORBIT}/:id`} element={<OrbitPage />} />
        <Route path={ROUTES.MISSION} element={<MissionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;