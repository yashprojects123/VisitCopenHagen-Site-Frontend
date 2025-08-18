import React, { useState, useRef } from "react";
import "./AddBanner.css";

const AddBanner = () => {
	const [topic, setTopic] = useState("");
	const [subTopic, setSubTopic] = useState("");
	const [description, setDescription] = useState("");
	const [caption, setCaption] = useState("");
	const [images, setImages] = useState([]);
	const fileInputRef = useRef();

	const handleImageSelect = (event) => {
		const file = event.target.files[0];
		if (!file || !file.type.startsWith("image/")) {
			alert("Please select an image file (e.g., PNG, JPG, GIF).");
			return;
		}
		if (images.length >= 2) {
			alert("Maximum 2 images allowed.");
			return;
		}
		const previewUrl = URL.createObjectURL(file);
		setImages((prev) => [...prev, { file, previewUrl }]);
		event.target.value = "";
	};

	const triggerFileInput = () => {
		if (fileInputRef.current) fileInputRef.current.click();
	};

	const handleRemoveImage = (imgIndex) => {
		setImages((prev) => prev.filter((_, i) => i !== imgIndex));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const bannerData = {
			topic,
			subTopic,
			description,
			caption,
			images: images.map((img) => img.file),
		};
		console.log("Banner Form Data:", bannerData);
	};

	return (
		<div className="add-banner-page">
			<h1>Add Banner Section</h1>
			<form onSubmit={handleSubmit}>
				<div className="input-group">
					<label className="input-label">Add main Topic</label>
					<input
						type="text"
						className="text-input"
						placeholder="Enter main topic for banner..."
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
					/>
				</div>
				<div className="input-group">
					<label className="input-label">Add Sub Topic</label>
					<input
						type="text"
						className="text-input"
						placeholder="Enter bottom subtopic for banner..."
						value={subTopic}
						onChange={(e) => setSubTopic(e.target.value)}
					/>
				</div>
				<div className="input-group">
					<label className="input-label">Add Description</label>
					<input
						type="text"
						className="text-input"
						placeholder="Enter Bottom Description for banner..."
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
				<div className="input-group">
					<label className="input-label">Add Caption</label>
					<input
						type="text"
						className="text-input"
						placeholder="Enter caption for banner..."
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
					/>
				</div>
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
						onClick={triggerFileInput}
						className="choose-image-button"
						disabled={images.length >= 2}
					>
						Choose Image
					</button>
					<span className="image-limit-text">
						Max 2 selected: ({images.length}/2)
					</span>
					<div className="image-previews">
						{images.map((imgData, imgIndex) => (
							<div key={imgIndex} className="image-preview-item">
								<img
									src={imgData.previewUrl}
									alt={`Banner Image ${imgIndex + 1}`}
									onError={(e) => {
										e.target.onerror = null;
										e.target.src =
											"https://placehold.co/100x100/FF0000/FFFFFF?text=Error";
									}}
								/>
								<button
									type="button"
									onClick={() => handleRemoveImage(imgIndex)}
									className="remove-image-button"
									aria-label="Remove image"
								>
									<svg
										className="w-4 h-4"
										fill="currentColor"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fillRule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										></path>
									</svg>
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
