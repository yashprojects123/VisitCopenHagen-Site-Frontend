import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getValidationSchema, DynamicSectionSchemas } from "../DynamicPageAdd/DynamicSectionSchemas";
import EditSectionRenderer from "./EditSectionRenderer"; 
import { publicApi } from "../../Services/axiosInstance";
import toast from "react-hot-toast";

function DynamicPageEdit() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pageTitleError, setPageTitleError] = useState("");
  const [newSlug, setNewSlug] = useState(slug);
  const [newSlugError, setNewSlugError] = useState("");
  const debounceTimeout = useRef();

  // RHF with yup validation
  const methods = useForm({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {
      title: "",
      sections: [],
    },
    mode: "onChange",
  });

  const { control, handleSubmit, reset } = methods;

  // ✅ allow append and remove sections
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  // Slug validation (same as before)
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      try {
        const regexForSlug = /[^a-zA-Z0-9_-]/;
        if (regexForSlug.test(newSlug)) {
          setNewSlugError("No special allowed in url alias [use _ and - only]");
        } else if (/[A-Z]/.test(newSlug)) {
          setNewSlugError("Only lowercase letters allowed");
        } else {
          setNewSlugError("");
        }
      } catch {
        setNewSlugError("");
      }
    }, 500);
  }, [newSlug]);

  // Fetch existing page
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await publicApi.get(`/api/page/${slug}`);
        const data = res.data;

        if (data.success) {
          reset({
            title: data.page.title,
            slug: data.page.slug,
            sections: data.page.sections || [],
          });
        }
      } catch (err) {
        toast.error("Failed to fetch page");
        setTimeout(() => navigate("/"), 1200);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug, reset, navigate]);

  // ---- Upload & Replace Images ---- (same as before)
  async function uploadAndReplaceImages(sections, publicApi) {
  async function processValue(value) {
    // Case 1: New single file
    if (value?.file instanceof File) {
      const formData = new FormData();
      formData.append("images", value.file);
      const res = await publicApi.post("/api/upload-images", formData);
      return { urls: res.data.imageUrls, isNew: true };
    }

    // Case 2: Existing image object with real URL
    if (value?.url && !value.url.startsWith("blob:")) {
      return { urls: [value.url], isNew: false };
    }

    // Case 3: Array of images
    if (Array.isArray(value)) {
      // If it's an array of objects/images
      const processed = [];
      for (const item of value) {
        processed.push(await processValue(item));
      }

      // flatten image objects (with urls) if it's clearly an image array
      if (processed.length && processed[0]?.urls) {
        return {
          urls: processed.flatMap((img) => img.urls),
          isNew: processed.some((img) => img.isNew),
        };
      }
      return processed; // otherwise it's a nested array (like columns)
    }

    // Case 4: Nested object (e.g. columns, subforms)
    if (value && typeof value === "object") {
      const newObj = {};
      for (const [k, v] of Object.entries(value)) {
        newObj[k] = await processValue(v);
      }
      return newObj;
    }

    // Default: return as is
    return value;
  }

  // Process each section
  for (const section of sections) {
    section.data = await processValue(section.data);
  }

  return sections;
}


  // Submit handler
  const onSubmit = async (formData) => {
    try {
      if (!formData.title?.trim()) {
        toast.error("Page title is required.");
        return;
      }
      if (newSlugError) {
        toast.error("Url Alias Error: " + newSlugError);
        return;
      }

      const processedSections = await uploadAndReplaceImages(formData.sections, publicApi);

      const finalData = {
        title: formData.title.trim(),
        slug,
        sections: processedSections,
      };

      const response = await publicApi.put(`/api/update-page/${slug}`, finalData);

      if (response.data.success) {
        toast.success("✅ Page updated successfully!");
        setTimeout(() => navigate(`/page/${slug}`), 1200);
      } else {
        toast.error("❌ " + (response.data.message || "Error updating page"));
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update failed");
    }
  };

  if (loading) return <p>Loading page...</p>;

  return (
    <FormProvider {...methods}>
      <form className="dynamic-page-form"  onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-4">Edit Page</h3>
        <div className="form-group">
          <label>Page Title</label>
          <input type="text" {...methods.register("title")} className="form-input" />
          {methods.formState.errors.title && (
            <p className="error-text">{methods.formState.errors.title.message}</p>
          )}
        </div>

        <div className="form-group ">
          <label>Url Alias</label>
          <div className="url-alias-wrapper">
            <span>page/</span>
            <input {...methods.register("slug")} onChange={(e) => setNewSlug(e.target.value)} />
          </div>
          {newSlugError && <span className="error">{newSlugError}</span>}
        </div>

        {/* Existing Sections */}
        {fields.map((field, index) => (
          <EditSectionRenderer
            key={field.id}
            section={field}
            index={index}
            remove={() => remove(index)}
            errors={methods.formState.errors}
          />
        ))}

        {/* ✅ Add Section Dropdown */}
        <div style={{ margin: "1rem 0" }}>
          <label>Add Section</label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                append({ type: e.target.value, data: {} });
                e.target.value = "";
              }
            }}
          >
            <option value="">-- Select Section Type --</option>
            {Object.entries(DynamicSectionSchemas).map(([key, schema]) => (
              <option key={key} value={key}>
                {schema.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Update</button>
        </div>
      </form>
    </FormProvider>
  );
}

export default DynamicPageEdit;
