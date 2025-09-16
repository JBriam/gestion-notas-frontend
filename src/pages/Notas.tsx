import Layout from "../components/Layout/Layout";

export default function Notas() {
  return (
    <Layout>
      <div className="container mt-4">
        <h1>Notas</h1>
        <p>Aquí puedes gestionar las notas de los estudiantes.</p>
        {/* Aquí irá el contenido específico de notas */}
      </div>
    </Layout>
  );
}