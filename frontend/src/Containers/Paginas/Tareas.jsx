import { useEffect } from "react";
import Layout from "../../hocs/layouts/layout";
import TareasPage from "../../Componentes/Tareas/Tareas";

function TareasComponent() {
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <Layout>
      <TareasPage />
    </Layout>
  );
}

export default TareasComponent;