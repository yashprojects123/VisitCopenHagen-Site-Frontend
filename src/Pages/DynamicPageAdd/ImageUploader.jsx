import React, { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

function ImageUploader({ name, sectionIndex, multiple = false, max = 1 }) {
  const { setValue, watch } = useFormContext();
  const inputRef = useRef(null);

  // Watch form value
  const formValue = watch(`sections.${sectionIndex}.data.${name}`) || [];

  const [previews, setPreviews] = useState([]);

  // ✅ Sync backend default (urls) into previews
  useEffect(() => {
    if (Array.isArray(formValue)) {
      // already normalized: array of {url, file?} OR backend {urls: []}
      if (formValue.length && formValue[0]?.urls) {
        // normalize backend shape → [{ url, file: null }]
        const normalized = formValue[0].urls.map((u) => ({ url: u, file: null }));
        setPreviews(normalized);
        setValue(`sections.${sectionIndex}.data.${name}`, normalized);
      } else if (formValue.length && formValue[0]?.url) {
        // already normalized previews
        setPreviews(formValue);
      }
    } else if (formValue?.urls) {
      // single image with { urls: [...] }
      const normalized = formValue.urls.map((u) => ({ url: u, file: null }));
      setPreviews(normalized);
      setValue(`sections.${sectionIndex}.data.${name}`, normalized);
    }
  }, [formValue, name, sectionIndex, setValue]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.file) URL.revokeObjectURL(p.url);
      });
    };
  }, [previews]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    let updated = multiple ? [...previews, ...newPreviews] : newPreviews;

    if (multiple && updated.length > max) {
      updated = updated.slice(0, max);
    }

    setPreviews(updated);
    setValue(`sections.${sectionIndex}.data.${name}`, updated);

    e.target.value = "";
  };

  const handleRemove = (idx) => {
    const updated = previews.filter((_, i) => i !== idx);
    setPreviews(updated);
    setValue(`sections.${sectionIndex}.data.${name}`, updated);
  };

  const isMaxReached = previews.length >= max;

  return (
    <div className="uploader-container">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        multiple={multiple}
        onChange={handleFileChange}
        className="file-input-hidden"
      />

      <button
        type="button"
        className="choose-btn"
        onClick={() => {
          if (isMaxReached) {
            toast.error(
              multiple
                ? `Maximum ${max} images allowed`
                : "Maximum image reached"
            );
          } else {
            inputRef.current.click();
          }
        }}
      >
        {multiple ? "Choose Images" : "Choose Image"}
      </button>

      <div className="preview-grid">
        {previews.map((img, idx) => (
          <div key={idx} className="preview-item">
            <img src={img.url} alt={`preview-${idx}`} className="preview-img" />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="remove-icon"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageUploader;
