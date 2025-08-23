// PageBuilder.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import SectionRenderer from "./SectionRenderer";
import './DynamicPageAdd.css';
import toast from 'react-hot-toast';
import { api, publicApi } from '../../Services/axiosInstance';
import { yupResolver } from "@hookform/resolvers/yup";
import { DynamicSectionSchemas, getValidationSchema } from "./DynamicSectionSchemas";

export default function DynamicPageAdd() {
const methods = useForm({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: { title: "", sections: [] },
    mode: "onChange", // Validate on change
    reValidateMode: "onChange",
  });

  const { handleSubmit, control, register, formState: { errors } } = methods;

  const [pageTitle, setPageTitle] = useState("");
  const [pageTitleError, setPageTitleError] = useState("");
  const [slug, setSlug] = useState("");
  const [slugError, setSlugError] = useState("");

  const { fields, append, remove } = useFieldArray({ control, name: "sections" });

  	const debounceTimeout = useRef();

	useEffect(() => {
		if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		debounceTimeout.current = setTimeout(async () => {
			try {
				// publicApi for page check
				const res = await publicApi.get(
					`/api/check-page-exists/?title=${pageTitle}`
				);
				if (res.data.success != false) {
					setPageTitleError("Page already exists.");
				} else {
					setPageTitleError("");
				}
			} catch {
				setPageTitleError("");
			}
		}, 500);
	}, [pageTitle]);

  	useEffect(() => {
		if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		debounceTimeout.current = setTimeout(async () => {
		try{
      const regexForSlug = /[^a-zA-Z0-9_-]/;
      if(regexForSlug.test(slug)){
        setSlugError("No special allowed in url alias [ Just you can use underscore(_) and (hyphen) ]");
      }
      if(/[A-Z]/.test(slug)){
        setSlugError("Only small letter allowed in url alias");
      }
        if(regexForSlug.test(slug) && /[A-Z]/.test(slug)){
        setSlugError("Special characters and Capital letter not allowed");
      }
    }catch{
      setSlugError("");
    }
		}, 500);
	}, [slug]);

async function uploadAndReplaceImages(sections, publicApi) {
  for (const section of sections) {
    // Walk through each key of section.data
    for (const [key, value] of Object.entries(section.data)) {
      
      // Case 1: multiple images (array)
      if (Array.isArray(value) && value.length && value[0]?.file) {
        const formData = new FormData();
        value.forEach((img) => formData.append("images", img.file));
        const res = await publicApi.post("/api/upload-images", formData);
        if (res.status === 200) {
          section.data[key] = { urls: res.data.imageUrls, isNew: true };
        }
      }

      // Case 2: single image
      else if (value?.file instanceof File) {
        const formData = new FormData();
        formData.append("images", value.file);
        const res = await publicApi.post("/api/upload-images", formData);
        if (res.status === 200) {
          section.data[key] = { urls: res.data.imageUrls, isNew: true };
        }
      }

      // Case 3: array of objects (like columns)
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

  const onSubmit = async(data) => {
    if (!pageTitle || pageTitle.trim() === '') {
			toast.error("Cannot save page: Page title is required.");
			console.warn("Save attempt failed: Page title is empty.");
			return; // Stop the function from proceeding
		}
    		if(pageTitleError!=""){
			toast.error(pageTitleError);
			return;
		}

    const processedSections = await uploadAndReplaceImages(data.sections, publicApi);

    // Step 2: build final payload
    const finalData = {
      title: data.title,
      slug: slug,
      sections: processedSections,
    };
    console.log("📤 Final Payload:", finalData);

      // try {
      //     const response = await api.post('/api/add-new-page', finalData);
      //     if (response.status === 201) {
      //       toast.success('Page saved successfully!');
      //       console.log(response.page);
      //       // Optionally clear the form or redirect
      //       setPageTitle('');
      //     } else {
      //       // This block might not be hit often if Axios catches non-2xx as errors
      //       toast.error('Failed to save page: ' + (response.data.message || 'Unknown error.'));
      //       console.error('Unexpected response status:', response.status, response.data);
      //     }
      //   } catch (error) {
      //     console.error('Error saving page:', error);
      //     if (error.response) {
      //       const errorMessage = error.response.data.message || 'Server error occurred.';
      //       toast.error(`Failed to save page: ${errorMessage}`);
      //     } else if (error.request) {
      //       // The request was made but no response was received
      //       toast.error('Failed to save page: No response from server. Please check your network connection.');
      //       console.error('No response received:', error.request);
      //     } else {
      //       // Something happened in setting up the request that triggered an Error
      //       toast.error('Failed to save page: An unexpected error occurred.');
      //       console.error('Axios config error:', error.message);
      //     }
      //   }

  };


  return (
    <FormProvider {...methods}>
      <form className="dynamic-page-form" onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-4">Add New Page</h3>
        {/* Page Title */}
        <div style={{ marginBottom: "1rem" }}>
          <label>Page Title</label>
          <input {...register("title")} placeholder="Enter page title" onChange={(e) => setPageTitle(e.target.value)} />
        </div>
{pageTitleError &&
						<span className="error">{pageTitleError}</span>}
            {errors.title && <p className="error">{errors.title.message}</p>}

            <div style={{ marginBottom: "1rem" }}>
          <label>Url Alias</label>
          <div>
            <span>page/</span>
            <input {...register("slug")} placeholder="Enter url alias for page. Eg., about, xyz" onChange={(e) => setSlug(e.target.value)} />
            </div>
            {slugError &&
						<span className="error">{slugError}</span>}
            {errors.slug && <p className="error">{errors.slug.message}</p>}
        </div>
        {/* Added Sections */}
        <div>
          {fields.map((field, index) => {
            const schema = DynamicSectionSchemas[field.type];
            return (
              <SectionRenderer
                key={field.id}
                schema={schema}
                index={index}
                remove={() => remove(index)}
                errors={errors}
              />
            );
          })}
        </div>

        {/* Add Section Dropdown */}
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
              <option key={key} value={key}>{schema.label}</option>
            ))}
          </select>
        </div>
        {errors.sections && <p className="error">{errors.sections.message}</p>}

        <button type="submit" style={{ background: "green", color: "white", padding: "0.5rem 1rem" }}>
          💾 Save Page
        </button>
      </form>
    </FormProvider>
  );
}
