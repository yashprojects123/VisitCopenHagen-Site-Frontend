import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getValidationSchema } from "../DynamicPageAdd/DynamicSectionSchemas";
import SectionRenderer from "../DynamicPageAdd/SectionRenderer";
import { publicApi } from "../../Services/axiosInstance";
import toast from "react-hot-toast";

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
	const { fields, append, remove } = useFieldArray({
		control,
		name: "sections",
	});

	// Fetch existing page
	useEffect(() => {
		const fetchPage = async () => {
			try {
				const res = await publicApi.get(`/api/page/${slug}`);
				const data = await res.data;

				if (data.success) {
					// ✅ Reset form with API values
					reset({
						title: data.page.title,
						sections: data.page.sections || [],
					});
				}
			} catch (err) {
				toast.error("Failed to fetch page:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchPage();
	}, [slug, reset]);

	// Submit handler
	const onSubmit = async (data) => {
		try {
			if (!pageTitle || pageTitle.trim() === "") {
				toast.error("Cannot save page: Page title is required.");
				console.warn("Save attempt failed: Page title is empty.");
				return; // Stop the function from proceeding
			}
			if (pageTitleError != "") {
				toast.error(pageTitleError);
				return;
			}

			const processedSections = await uploadAndReplaceImages(
				data.sections,
				publicApi
			);
			const finalData = {
				title: data.title,
				slug: pageSlug,
				sections: processedSections,
			};

			const response = await publicApi.put(
				`/api/update-page/${data.slug}`,
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

			const data = await res.json();
			if (data.success) {
				alert("Page updated successfully!");
				navigate(`/pages/${slug}`); // redirect to page view
			} else {
				alert(data.message || "Update failed");
			}
		} catch (err) {
			console.error("Update failed:", err);
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
				</div>

				{/* Render dynamic sections */}
				{fields.map((field, index) => (
					<SectionRenderer
						key={field.id}
						schema={field}
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
