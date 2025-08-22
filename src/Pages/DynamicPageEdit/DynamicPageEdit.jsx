import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getValidationSchema } from "../DynamicPageAdd/DynamicSectionSchemas";
import EditSectionRenderer from "./EditSectionRenderer"; 
import { publicApi } from "../../Services/axiosInstance";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
function DynamicPageEdit() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  // Allow dynamic sections
  const { fields, remove } = useFieldArray({
    control,
    name: "sections",
  });

  // Helper: upload and replace images
  async function uploadAndReplaceImages(sections, publicApi) {
    for (const section of sections) {
      for (const [key, value] of Object.entries(section.data)) {
        // multiple images
        if (Array.isArray(value) && value.length && value[0]?.file) {
          const formData = new FormData();
          value.forEach((img) => formData.append("images", img.file));
          const res = await publicApi.post("/api/upload-images", formData);
          if (res.status === 200) {
            section.data[key] = { urls: res.data.imageUrls, isNew: true };
          }
        }
        // single image
        else if (value?.file instanceof File) {
          const formData = new FormData();
          formData.append("images", value.file);
          const res = await publicApi.post("/api/upload-images", formData);
          if (res.status === 200) {
            section.data[key] = { urls: res.data.imageUrls, isNew: true };
          }
        }
        // array of objects (like columns)
        else if (Array.isArray(value) && value.length && typeof value[0] === "object") {
          for (const col of value) {
            if (col.image?.file) {
              const formData = new FormData();
              formData.append("images", col.image.file);
              const res = await publicApi.post("/api/upload-images", formData);
              if (res.status === 200) {
                col.image = { urls: res.data.imageUrls, isNew: true };
              }
            }
          }
        }
      }
    }
    return sections;
  }

  // Fetch existing page
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await publicApi.get(`/api/page/${slug}`);
        const data = res.data;

        if (data.success) {
          reset({
            title: data.page.title,
            sections: data.page.sections || [],
          });
        }
      } catch (err) {
        toast.error("Failed to fetch page");
      setTimeout(()=>{ navigate('/')},1200)
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug, reset]);

  // Submit handler
  const onSubmit = async (formData) => {
    try {
      if (!formData.title || formData.title.trim() === "") {
        toast.error("Page title is required.");
        return;
      }

      const processedSections = await uploadAndReplaceImages(
        formData.sections,
        publicApi
      );

      const finalData = {
        title: formData.title,
        slug: slug, // keep same slug
        sections: processedSections,
      };

      const response = await publicApi.put(
        `/api/update-page/${slug}`,
        finalData
      );

      if (response.data.success) {
        toast.success("✅ Page updated successfully!");
        setTimeout(() => {
          navigate(`/pages/${slug}`);
        }, 1200);
      } else {
        toast.error("❌ Error updating page: " + response.data.message);
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update failed");
    }
  };

  if (loading) return <p>Loading page...</p>;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="page-form">
        <div className="form-group">
          <label>Page Title</label>
          <input
            type="text"
            {...methods.register("title")}
            className="form-input"
          />
          {methods.formState.errors.title && (
            <p className="error-text">{methods.formState.errors.title.message}</p>
          )}
        </div>

        {/* Render dynamic sections with EditSectionRenderer */}
        {fields.map((field, index) => (
          <EditSectionRenderer
            key={field.id}
            section={field}
            index={index}
            remove={() => remove(index)}
            errors={methods.formState.errors}
          />
        ))}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default DynamicPageEdit;
