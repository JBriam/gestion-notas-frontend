import { useEffect, useState } from "react";
import type { Curso } from "../../interfaces/Curso";
import { CursoService } from "../../api/CursoService";

interface Props {
  onSaved: () => void;
  cursoEdit?: Curso | null;
  clearEdit: () => void;
}

export default function FormCurso({
  onSaved,
  cursoEdit,
  clearEdit,
}: Props) {
  const [form, setForm] = useState<Curso>({
    nombre: "",
    codigoCurso: "",
    descripcion: "",
    creditos: undefined,
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [tocado, setTocado] = useState<{ [key: string]: boolean }>({}); // Campos ya tocados

  useEffect(() => {
    if (cursoEdit) {
      setForm({
        nombre: cursoEdit.nombre || "",
        codigoCurso: cursoEdit.codigoCurso || "",
        descripcion: cursoEdit.descripcion || "",
        creditos: cursoEdit.creditos || undefined,
      });
    } else {
      setForm({
        nombre: "",
        codigoCurso: "",
        descripcion: "",
        creditos: undefined,
      });
    }
    setErrores({});
    setTocado({});
  }, [cursoEdit]);

  const validarFormulario = (formData: Curso) => {
    const errs: { [key: string]: string } = {};

    // Nombre
    if (!formData.nombre || formData.nombre.trim().length < 3)
      errs.nombre = "El nombre es obligatorio y debe tener al menos 3 caracteres";
    else if (formData.nombre.length > 100)
      errs.nombre = "El nombre no puede exceder 100 caracteres";

    // Código
    const codigo = formData.codigoCurso ? formData.codigoCurso.trim() : "";
    if (codigo.length < 3)
      errs.codigoCurso = "El código es obligatorio y debe tener al menos 3 caracteres";
    else if (codigo.length > 20)
      errs.codigoCurso = "El código no puede exceder 20 caracteres";
    else if (!/^[a-zA-Z0-9]+$/.test(codigo))
      errs.codigoCurso = "El código solo puede contener letras y números";

    // Descripción
    if (formData.descripcion && formData.descripcion.length > 200)
      errs.descripcion = "La descripción no puede exceder 200 caracteres";

    // Créditos
    const creditosNum = Number(formData.creditos);
    if (!formData.creditos || isNaN(creditosNum))
      errs.creditos = "Los créditos son obligatorios";
    else if (creditosNum < 1 || creditosNum > 10)
      errs.creditos = "Los créditos deben ser un número entre 1 y 10";

    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const nuevoForm = { ...form, [name]: value };
    setForm(nuevoForm);

    // Validar en tiempo real
    const nuevosErrores = validarFormulario(nuevoForm);
    setErrores(nuevosErrores);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTocado({ ...tocado, [name]: true });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario(form);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      console.log("Formulario inválido, no se envía. Errores:", nuevosErrores);
      setTocado({ nombre: true, codigoCurso: true, descripcion: true, creditos: true });
      return;
    }

    try {
      if (cursoEdit) {
        await CursoService.actualizar(form);
      } else {
        await CursoService.crear(form);
      }

      onSaved();
      clearEdit();
      setForm({
        nombre: "",
        codigoCurso: "",
        descripcion: "",
        creditos: undefined,
      });
      setErrores({});
      setTocado({});
    } catch (error) {
      console.error("Error al guardar curso:", error);
    }
  };

  // Función auxiliar para marcar si un campo es válido o inválido
  const claseCampo = (nombreCampo: string) => {
    if (!tocado[nombreCampo]) return "form-control";
    return errores[nombreCampo] ? "form-control is-invalid" : "form-control is-valid";
  };

  return (
    <div className="table-responsive">
      <form onSubmit={handleSubmit} noValidate>
        {/* Nombre */}
        <div className="mb-3">
          <label className="form-label">
            Nombre <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={claseCampo("nombre")}
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ingresa el nombre del curso (mín. 3 caracteres)"
          />
          {errores.nombre && (
            <div className="invalid-feedback d-block">{errores.nombre}</div>
          )}
        </div>

        {/* Código */}
        <div className="mb-3">
          <label className="form-label">
            Código <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={claseCampo("codigoCurso")}
            name="codigoCurso"
            value={form.codigoCurso}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Código del curso (solo letras y números, mín. 3)"
          />
          {errores.codigoCurso && (
            <div className="invalid-feedback d-block">{errores.codigoCurso}</div>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label className="form-label">
            Descripción <span className="text-muted">(Opcional)</span>
          </label>
          <textarea
            className={claseCampo("descripcion")}
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Descripción del curso (máx. 200 caracteres)"
            maxLength={200}
            rows={3}
          />
          <small className="form-text text-muted">
            {(form.descripcion || "").length}/200 caracteres
          </small>
          {errores.descripcion && (
            <div className="invalid-feedback d-block">{errores.descripcion}</div>
          )}
        </div>

        {/* Créditos */}
        <div className="mb-3">
          <label className="form-label">
            Créditos <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className={claseCampo("creditos")}
            name="creditos"
            value={form.creditos === undefined ? "" : form.creditos}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Créditos (1-10)"
            min={1}
            max={10}
          />
          {errores.creditos && (
            <div className="invalid-feedback d-block">{errores.creditos}</div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={Object.keys(errores).length > 0}
          >
            {cursoEdit ? "Actualizar" : "Registrar"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            onClick={clearEdit}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
