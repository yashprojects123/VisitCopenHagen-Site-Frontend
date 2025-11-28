import React, { useRef } from "react";
import "./AddBanner.css";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const AddBanner = () => {
  const fileInputRef = useRef();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      topic: "",
      subTopic: "",
      description: "",
      caption: "",
      images: [],
    },
  });

  const images = watch("images");
  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (images.length >= 2) {
      alert("Maximum 2 images allowed");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const updatedImages = [...images, { file, previewUrl }];

    setValue("images", updatedImages);
    event.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setValue("images", updated);
  };
		const uploadBannerToServer = async (file) => {
			console.log("Uploading file:", file);
			if (!file) return null;
			try {
				const formData = new FormData();
				formData.append("images", file);
	
				const response = await axios.post(
					`${import.meta.env.VITE_BACKEND_URL}/api/upload-images`,
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } }
				);
				console.log("Upload response:", response);
				if (response.data?.success) {
					return response.data.data.images[0]?.url || null;
				}
	
				toast.error("banner upload failed!");
				return null;
			} catch {
				toast.error("Error uploading banner!");
				return null;
			}
		};
	
  const onSubmit = (data) => {
		let bannerImages = data.images;
		let imageFiles = [];
		if(data.images){
			imageFiles = data.images.map((img) => img.file);
		}
		let uploadedImageUrls = [];
		if(imageFiles && imageFiles.length > 0){
			 uploadedImageUrls = imageFiles.map(async(file) => {
				const url = await uploadBannerToServer(file);

				if(url){
					console.log("Uploaded image URL:", url);
					return url;
				}else{
					return "";
				}
			});
		}
    const finalData = {
			pageName: data.pageName,
      topic: data.topic,
      subTopic: data.subTopic,
      description: data.description,
      caption: data.caption,
      images: uploadedImageUrls,
    };

    console.log("Banner Form Data:", finalData);
  };

  return (
    <div className="add-banner-page">
      <h1>Add Banner Section</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Topic */}

				<div className="input-group">
          <label className="input-label">Page Name</label>
          <input
            type="text"
            className="text-input"
            placeholder="Enter page name..."
            {...register("pageName", { required: "Page Name is required" })}
          />
          {errors.pageName && <p className="error">{errors.pageName.message}</p>}
        </div>

        <div className="input-group">
          <label className="input-label">Add Main Topic</label>
          <input
            type="text"
            className="text-input"
            placeholder="Enter main topic..."
            {...register("topic", { required: "Topic is required" })}
          />
          {errors.topic && <p className="error">{errors.topic.message}</p>}
        </div>

        {/* Sub Topic */}
        <div className="input-group">
          <label className="input-label">Add Sub Topic</label>
          <input
            type="text"
            className="text-input"
            placeholder="Enter sub topic..."
            {...register("subTopic")}
          />
        </div>

        {/* Description */}
        <div className="input-group">
          <label className="input-label">Add Description</label>
          <input
            type="text"
            className="text-input"
            placeholder="Enter description..."
            {...register("description")}
          />
        </div>

        {/* Caption */}
        <div className="input-group">
          <label className="input-label">Add Caption</label>
          <input
            type="text"
            className="text-input"
            placeholder="Enter caption..."
            {...register("caption")}
          />
        </div>

        {/* Image Upload */}
        <div className="image-upload-area">
          <span className="image-upload-label">Add Image</span>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageSelect}
          />

          <button
            type="button"
            className="choose-image-button"
            onClick={triggerFileInput}
            disabled={images && images.length >= 2}
          >
            Choose Image
          </button>

          <span className="image-limit-text">
            Max 2 selected ({images?.length || 0}/2)
          </span>



          <div className="image-previews">
            {images?.map((imgData, index) => (
              <div key={index} className="image-preview-item">
                <img src={imgData.previewUrl} alt="Preview" />

                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() => handleRemoveImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

			
        <button type="submit" className="submit-banner-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddBanner;
