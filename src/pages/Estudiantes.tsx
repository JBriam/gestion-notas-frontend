import Layout from "../components/Layout/Layout";
export default function Estudiantes() {
  return (
    <Layout>
          <div className="container mt-4">
            <h1>Estudiantes</h1>
            <p>Aquí puedes gestionar los estudiantes del sistema.</p>
            {/* Aquí irá el contenido específico de estudiantes */}
          </div>
        </Layout>
  );
}