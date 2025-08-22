import { useFormContext, useFieldArray } from "react-hook-form";
import ImageUploader from "../DynamicPageAdd/ImageUploader";
import { DynamicSectionSchemas } from "../DynamicPageAdd/DynamicSectionSchemas";

function EditSectionRenderer({ section, index, remove, errors }) {
  console.log(section)
  const { register, control, getValues } = useFormContext();

  // Schema definition from section type
  const schema = DynamicSectionSchemas[section.type];
  if (!schema) {
    return <p className="error-text">Unsupported section type: {section.type}</p>;
  }

  const fields = Array.isArray(schema.fields) ? schema.fields : [schema.fields];

  return (
    <div className="section-container">
      <h3 className="section-title">{schema.label}</h3>

      {fields.map((field) => {
        const fieldPath = `sections.${index}.data.${field.name}`;
        const fieldError = errors?.sections?.[index]?.data?.[field.name];
        const currentValue =
          getValues(fieldPath) ?? section.data?.[field.name] ?? "";

        // ✅ Text input
        if (field.type === "text") {
          return (
            <div key={field.name} className="form-group">
              <label className="form-label">{field.label}</label>
              <input
                type="text"
                {...register(fieldPath)}
                defaultValue={currentValue}
                placeholder={field.placeholder || ""}
                className="form-input"
              />
              {fieldError && <p className="error-text">{fieldError.message}</p>}
            </div>
          );
        }

        // ✅ Textarea
        if (field.type === "textarea") {
          return (
            <div key={field.name} className="form-group">
              <label className="form-label">{field.label}</label>
              <textarea
                {...register(fieldPath)}
                defaultValue={currentValue}
                placeholder={field.placeholder || ""}
                rows={field.rows || 3}
                className="form-textarea"
              />
              {fieldError && <p className="error-text">{fieldError.message}</p>}
            </div>
          );
        }

        // ✅ Single image
        if (field.type === "image" || field.type === "file") {
          return (
            <div key={field.name} className="form-group">
              <label className="form-label">{field.label}</label>
              <ImageUploader
                name={field.name}
                sectionIndex={index}
                multiple={false}
                defaultValue={currentValue}
              />
              {fieldError && <p className="error-text">{fieldError.message}</p>}
            </div>
          );
        }

        // ✅ Multiple images
        if (field.type === "array" && field.itemType === "image") {
          return (
            <div key={field.name} className="form-group">
              <label className="form-label">{field.label}</label>
              <ImageUploader
                name={field.name}
                sectionIndex={index}
                multiple={true}
                max={field.max || 5}
                defaultValue={currentValue}
              />
              {fieldError && <p className="error-text">{fieldError.message}</p>}
            </div>
          );
        }

        // ✅ Array of objects (e.g. columns)
        if (field.type === "array" && field.fields) {
          const { fields: arrayFields, append, remove: removeItem } = useFieldArray({
            control,
            name: fieldPath,
          });

          return (
            <div key={field.name} className="form-group">
              <label className="form-label">{field.label}</label>

              {arrayFields.map((item, subIndex) => (
                <div key={item.id} className="sub-item">
                  {field.fields.map((subField) => {
                    const subPath = `${fieldPath}.${subIndex}.${subField.name}`;
                    const subError = fieldError?.[subIndex]?.[subField.name];
                    const subValue =
                      getValues(subPath) ??
                      section.data?.[field.name]?.[subIndex]?.[subField.name] ??
                      "";

                    if (subField.type === "text") {
                      return (
                        <div key={subField.name} className="form-sub-group">
                          <label>{subField.label}</label>
                          <input
                            type="text"
                            {...register(subPath)}
                            defaultValue={subValue}
                          />
                          {subError && <p className="error-text">{subError.message}</p>}
                        </div>
                      );
                    }

                    if (subField.type === "textarea") {
                      return (
                        <div key={subField.name} className="form-sub-group">
                          <label>{subField.label}</label>
                          <textarea
                            {...register(subPath)}
                            defaultValue={subValue}
                            rows={subField.rows || 3}
                          />
                          {subError && <p className="error-text">{subError.message}</p>}
                        </div>
                      );
                    }

                    if (subField.type === "image" || subField.type === "file") {
                      return (
                        <div key={subField.name} className="form-sub-group">
                          <label>{subField.label}</label>
                          <ImageUploader
                            name={`${field.name}.${subIndex}.${subField.name}`}
                            sectionIndex={index}
                            multiple={false}
                            defaultValue={subValue}
                          />
                          {subError && <p className="error-text">{subError.message}</p>}
                        </div>
                      );
                    }

                    return (
                      <p key={subField.name} className="error-text">
                        Unsupported sub-field type: {subField.type}
                      </p>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => removeItem(subIndex)}
                    className="remove-btn"
                  >
                    Remove Item
                  </button>
                </div>
              ))}

              {arrayFields.length < (field.max || Infinity) && (
                <button
                  type="button"
                  onClick={() => append({})}
                  className="add-btn"
                >
                  + Add Item
                </button>
              )}
            </div>
          );
        }

        return (
          <p key={field.name} className="error-text">
            Unsupported field type: {field.type}
          </p>
        );
      })}

      <button type="button" onClick={remove} className="remove-btn">
        🗑 Remove Section
      </button>
    </div>
  );
}

export default EditSectionRenderer;
