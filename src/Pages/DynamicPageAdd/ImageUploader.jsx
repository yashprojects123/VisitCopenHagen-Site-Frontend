import React, { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

function ImageUploader({ name, sectionIndex, multiple = false, max = 1 }) {
  const { setValue, watch } = useFormContext();
  const inputRef = useRef(null);

  // Watch current value from react-hook-form
  const images = watch(`sections.${sectionIndex}.data.${name}`) || [];
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    // Cleanup object URLs when component unmounts
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Create preview URLs
    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    let updated = multiple ? [...images, ...newPreviews] : newPreviews;

    // Limit by max
    if (multiple && updated.length > max) {
      updated = updated.slice(0, max);
    }

    setPreviews(updated);
    setValue(`sections.${sectionIndex}.data.${name}`, updated);

    // Reset input so same file can be reselected if removed
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
      {/* ✅ Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        multiple={multiple}
        onChange={handleFileChange}
        className="file-input-hidden"
      />

      {/* ✅ Custom button */}
      <button
        type="button"
        className="choose-btn"
        // disabled={isMaxReached}
        onClick={(e) => {
        
          if (isMaxReached && multiple) {  
            toast.error(`Maximum ${max} images allowed`);
          }else if (isMaxReached && !multiple) {
            toast.error("Maximum image reached");
          }
          else{
             inputRef.current.click();
          }
        }}
      >
        {multiple
          ? "Choose Images"
          : "Choose Image"}
      </button>

      {/* ✅ Preview thumbnails */}
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
