import React, { useState, useRef, useEffect } from "react";
import "./AddDynamicPage.css";
import { api } from "../../../Services/axiosInstance";

const AddDynamicPage = () => {
	const [pageTitle, setPageTitle] = useState("");
	const [selectedSectionType, setSelectedSectionType] = useState("");
	const [addedSections, setAddedSections] = useState([]);
	const fileInputRefs = useRef({});

  useEffect(() => {
    console.log(addedSections)
  }, [addedSections]);

  
	// Handler for the Banner Section
	const handleBannerTopicChange = (id, newTopic) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "banner"
					? { ...section, data: { ...section.data, topic: newTopic } }
					: section
			)
		);
	};

	const handleBannerSubTopicChange = (id, newSubTopic) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "banner"
					? { ...section, data: { ...section.data, subTopic: newSubTopic } }
					: section
			)
		);
	};

	const handleBannerDescriptionChange = (id, newDescription) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "banner"
					? {
							...section,
							data: { ...section.data, description: newDescription },
					  }
					: section
			)
		);
	};

	const handleBannerCaptionChange = (id, newDescription) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "banner"
					? {
							...section,
							data: { ...section.data, description: newDescription },
					  }
					: section
			)
		);
	};

	const handleBannerImageSelect = (id, event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
        alert("Please select an image file (e.g., PNG, JPG, GIF).");
        return;
    }

    setAddedSections((prevSections) =>
        prevSections.map((section) => {
            if (section.id === id && section.type === "banner") {
                const currentImages = section.data.images || [];
                if (currentImages.length < 2) {
                    // Create a temporary URL for immediate preview
                    const previewUrl = URL.createObjectURL(file);
                    return {
                        ...section,
                        data: {
                            ...section.data,
                            // Store both the File object and its temporary preview URL
                            images: [...currentImages, { file, previewUrl }],
                        },
                    };
                } else {
                    alert("Maximum 2 images already selected for this banner section.");
                }
            }
            return section;
        })
    );
    // Clear the input value so the same file can be selected again if needed
    event.target.value = "";
};

	const triggerBannerFileInput = (id) => {
		if (fileInputRefs.current[id]) {
			fileInputRefs.current[id].click();
		}
	};

	const handleBannerRemoveImage = (sectionId, imageIndex) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) => {
				if (section.id === sectionId && section.type === "banner") {
					return {
						...section,
						data: {
							...section.data,
							images: section.data.images.filter((_, i) => i !== imageIndex),
						},
					};
				}
				return section;
			})
		);
	};

	// Handlers for the Three-Columns Section
	const handleThreeColumnsTopicChange = (id, newTopic) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "three-columns"
					? { ...section, data: { ...section.data, topic: newTopic } }
					: section
			)
		);
	};

	const handleThreeColumnsClassNameChange = (id, newClassName) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "three-columns"
					? { ...section, data: { ...section.data, className: newClassName } }
					: section
			)
		);
	};
	const handleThreeColumnsDescriptionChange = (id, newDescription) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "three-columns"
					? {
							...section,
							data: { ...section.data, description: newDescription },
					  }
					: section
			)
		);
	};
	const handleThreeColumnsAddColumn = (threeColumnsSectionId) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) => {
				if (
					section.id === threeColumnsSectionId &&
					section.type === "three-columns"
				) {
					const currentSubforms = section.data.subforms || [];
					if (currentSubforms.length < 3) {
						const newSubform = {
							id: `subform-${Date.now()}-${Math.random()
								.toString(36)
								.substring(2, 9)}`,
							title: "",
							description: "",
							image: null,
						};
						return {
							...section,
							data: {
								...section.data,
								subforms: [...currentSubforms, newSubform],
							},
						};
					} else {
						alert("Maximum 3 subforms can be added to this 3 columns section.");
					}
				}
				return section;
			})
		);
	};
	const handlethreeColumnsSubformImageSelect = (
		sectionId,
		subformId,
		event
	) => {
		const file = event.target.files[0];
		if (!file || !file.type.startsWith("image/")) {
			alert("Please select an image file (e.g., PNG, JPG, GIF).");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setAddedSections((prevSections) =>
				prevSections.map((section) => {
					if (section.id === sectionId && section.type === "three-columns") {
						return {
							...section,
							data: {
								...section.data,
								subforms: section.data.subforms.map((subform) =>
									subform.id === subformId
										? { ...subform, image: reader.result }
										: subform
								),
							},
						};
					}
					return section;
				})
			);
		};
		reader.readAsDataURL(file);
		event.target.value = "";
	};
	const handleThreeColumnsSubformInputChange = (
		sectionId,
		subformId,
		field,
		value
	) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) => {
				if (section.id === sectionId && section.type === "three-columns") {
					return {
						...section,
						data: {
							...section.data,
							subforms: section.data.subforms.map((subform) =>
								subform.id === subformId
									? { ...subform, [field]: value }
									: subform
							),
						},
					};
				}
				return section;
			})
		);
	};
	const handleThreeColumnsRemoveSubform = (sectionId, subformId) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) => {
				if (section.id === sectionId && section.type === "three-columns") {
					return {
						...section,
						data: {
							...section.data,
							subforms: section.data.subforms.filter(
								(subform) => subform.id !== subformId
							),
						},
					};
				}
				return section;
			})
		);
	};

	// New: Handlers for the Four-Columns Section
	const handleFourColumnsTopicChange = (id, newTopic) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "four-columns"
					? { ...section, data: { ...section.data, topic: newTopic } }
					: section
			)
		);
	};
	const handleFourColumnsDescriptionChange = (id, newDescription) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "four-columns"
					? {
							...section,
							data: { ...section.data, description: newDescription },
					  }
					: section
			)
		);
	};
	const handleFourColumnsAddColumn = (fourColumnsSectionId) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) => {
				if (
					section.id === fourColumnsSectionId &&
					section.type === "four-columns"
				) {
					const currentSubforms = section.data.subforms || [];
					if (currentSubforms.length < 4) {
						const newSubform = {
							id: `subform-${Date.now()}-${Math.random()
								.toString(36)
								.substring(2, 9)}`,
							title: "",
							link: "",
							image: null,
						};
						return {
							...section,
							data: {
								...section.data,
								subforms: [...currentSubforms, newSubform],
							},
						};
					} else {
						alert("Maximum 4 subforms can be added to this 4 columns section.");
					}
				}
				return section;
			})
		);
	};
	const handleFourColumnsSubformImageSelect = (sectionId, subformId, event) => {
		const file = event.target.files[0];
		if (!file || !file.type.startsWith("image/")) {
			alert("Please select an image file (e.g., PNG, JPG, GIF).");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setAddedSections((prevSections) =>
				prevSections.map((section) => {
					if (section.id === sectionId && section.type === "four-columns") {
						return {
							...section,
							data: {
								...section.data,
								subforms: section.data.subforms.map((subform) =>
									subform.id === subformId
										? { ...subform, image: reader.result }
										: subform
								),
							},
						};
					}
					return section;
				})
			);
		};
		reader.readAsDataURL(file);
		event.target.value = "";
	};
	const handleFourColumnsSubformInputChange = (
		sectionId,
		subformId,
		field,
		value
	) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) => {
				if (section.id === sectionId && section.type === "four-columns") {
					return {
						...section,
						data: {
							...section.data,
							subforms: section.data.subforms.map((subform) =>
								subform.id === subformId
									? { ...subform, [field]: value }
									: subform
							),
						},
					};
				}
				return section;
			})
		);
	};
	const handleFourColumnsRemoveSubform = (sectionId, subformId) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) => {
				if (section.id === sectionId && section.type === "four-columns") {
					return {
						...section,
						data: {
							...section.data,
							subforms: section.data.subforms.filter(
								(subform) => subform.id !== subformId
							),
						},
					};
				}
				return section;
			})
		);
	};

	const handleBigBannerWithTextCardTopicChange = (id, newTopic) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "big-banner-with-text-card"
					? { ...section, data: { ...section.data, topic: newTopic } }
					: section
			)
		);
	};
	const handleBigBannerWithTextCardDescriptionChange = (id, newDescription) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "big-banner-with-text-card"
					? {
							...section,
							data: { ...section.data, description: newDescription },
					  }
					: section
			)
		);
	};
	const handleBigBannerWithTextCardImageSelect = (id, event) => {
		const file = event.target.files[0];
		if (!file || !file.type.startsWith("image/")) {
			alert("Please select an image file (e.g., PNG, JPG, GIF).");
			return;
		}
		const reader = new FileReader();
		reader.onloadend = () => {
			setAddedSections((prevSections) =>
				prevSections.map((section) => {
					if (
						section.id === id &&
						section.type === "big-banner-with-text-card"
					) {
						return {
							...section,
							data: {
								...section.data,
								bigImage: reader.result,
							},
						};
					}
					return section;
				})
			);
		};
		reader.readAsDataURL(file);
		event.target.value = "";
	};
	const handleBigBannerWithTextCardImageCaptionChange = (id, newCaption) => {
		setAddedSections((prevSections) =>
			prevSections.map((section) =>
				section.id === id && section.type === "big-banner-with-text-card"
					? { ...section, data: { ...section.data, imageCaption: newCaption } }
					: section
			)
		);
	};

	// General handlers
	const handleAddSection = () => {
		if (selectedSectionType) {
			const newSection = {
				id: `section-${Date.now()}-${Math.random()
					.toString(36)
					.substring(2, 9)}`,
				type: selectedSectionType,
				data: {},
			};
			if (selectedSectionType === "banner") {
				newSection.data = {
					topic: "",
					images: [],
					subTopic: "",
					description: "",
					imageCaption: "",
				};
			} else if (selectedSectionType === "three-columns") {
				newSection.data = {
					topic: "",
					description: "",
					className: "",
					subforms: [],
				};
			} else if (selectedSectionType === "four-columns") {
				newSection.data = { topic: "", description: "", subforms: [] };
			} else if (selectedSectionType === "big-banner-with-text-card") {
				newSection.data = {
					topic: "",
					description: "",
					bigImage: null,
					imageCaption: "",
				};
			} else {
				newSection.data = { content: "" };
			}
			setAddedSections((prevSections) => [...prevSections, newSection]);
			setSelectedSectionType("");
		}
	};
	const handleRemoveSection = (idToRemove) => {
		setAddedSections((prevSections) =>
			prevSections.filter((section) => section.id !== idToRemove)
		);
	};
 const handleSavePage = async() => {
    // **NEW VALIDATION: Check if pageTitle is empty**
    if (!pageTitle || pageTitle.trim() === '') {
        alert("Cannot save page: Page title is required.");
        console.warn("Save attempt failed: Page title is empty.");
        return; // Stop the function from proceeding
    }

    // 1. Process and filter sections before saving
    const filteredSections = addedSections.flatMap((section) => {
        let filteredSection = { ...section };

        // Handle sections with subforms (3-columns, 4-columns)
        if (
            filteredSection.type === "three-columns" ||
            filteredSection.type === "four-columns"
        ) {
            const filteredSubforms = (filteredSection.data.subforms || []).filter(
                (subform) => {
                    // Keep subforms that have a non-empty title
                    return subform.title && subform.title.trim() !== "";
                }
            );

            // Update the section's data with the filtered subforms
            filteredSection.data = {
                ...filteredSection.data,
                subforms: filteredSubforms,
            };

            // If no subforms remain, this section is considered empty and will be removed later
            if (filteredSubforms.length === 0) {
                return []; // Return an empty array to flatMap, effectively removing the section
            }
        } else if (filteredSection.type === "big-banner-with-text-card") {
            // Remove BigBanner section if the bigImage is null
            if (!filteredSection.data.bigImage) {
                return [];
            }
        } else if (filteredSection.type === "banner") {
            // Remove Banner section if the images array is empty
            if (
                !filteredSection.data.images ||
                filteredSection.data.images.length === 0
            ) {
                return [];
            }
        }

        return [filteredSection]; // Keep the section if it passed the checks
    });

    // 2. Check if the final filteredSections array is empty
    if (filteredSections.length === 0) {
        alert(
            "Cannot save page: At least one section with valid data is required."
        );
        console.warn("Save attempt failed: No valid sections found.");
        return; // Stop the function from proceeding
    }

    // Generate the slug from the pageTitle
    const pageSlug = pageTitle
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
        .replace(/--+/g, '-') // Replace multiple hyphens with a single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // 3. Create the final pageData object with the filtered sections and the new slug
    const pageData = {
        id: `page-${Date.now()}`,
        title: pageTitle,
        slug: pageSlug, // Add the generated slug here
        sections: filteredSections.map((section) => ({
            id: section.id,
            type: section.type,
            data: section.data,
        })),
    };

    console.log("Trying to Save Page Data:", pageData);
    

    // 4. Make the API request
        try {
            const response = await api.post('/api/add-new-page', pageData);

            if (response.status === 201) {
                alert('Page saved successfully! Page ID: ' + response.data.page.id);
                console.log('Page saved response:', response.data);
                // Optionally clear the form or redirect
                setPageTitle('');
                setAddedSections([]);
                setSelectedSectionType('');
            } else {
                // This block might not be hit often if Axios catches non-2xx as errors
                alert('Failed to save page: ' + (response.data.message || 'Unknown error.'));
                console.error('Unexpected response status:', response.status, response.data);
            }
        } catch (error) {
            console.error('Error saving page:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorMessage = error.response.data.message || 'Server error occurred.';
                alert(`Failed to save page: ${errorMessage}`);
                console.error('Server Error Data:', error.response.data);
                console.error('Server Error Status:', error.response.status);
                console.error('Server Error Headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                alert('Failed to save page: No response from server. Please check your network connection.');
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                alert('Failed to save page: An unexpected error occurred.');
                console.error('Axios config error:', error.message);
            }
        }
};

	return (
		<div className="app-container">
			<div className="form-card">
				<h1 className="main-title">Create New Page</h1>
				<div className="input-group">
					<label htmlFor="pageTitle" className="input-label">
						Add Page title
					</label>
					<input
						type="text"
						id="pageTitle"
						className="text-input"
						placeholder="Enter your page title here..."
						value={pageTitle}
						onChange={(e) => setPageTitle(e.target.value)}
					/>
				</div>
				{addedSections.length > 0 && (
					<div className="added-sections-container">
						<h2 className="added-sections-title">Added Sections</h2>
						{addedSections.map((section, index) => (
							<div key={section.id} className="section-card">
								<button
									onClick={() => handleRemoveSection(section.id)}
									className="remove-section-button"
									aria-label="Remove section"
									title="Remove this section"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										></path>
									</svg>
								</button>
								<div className="section-header">
									<span className="section-title">
										{index + 1}.{" "}
										{section.type.charAt(0).toUpperCase() +
											section.type.slice(1)}{" "}
										Section
									</span>
								</div>
								<div className="section-content">
									{section.type === "banner" && (
										<>
											<div className="input-group">
												<label
													htmlFor={`bannerTopic-${section.id}`}
													className="input-label"
												>
													Add main Topic
												</label>
												<input
													type="text"
													id={`bannerTopic-${section.id}`}
													className="text-input"
													placeholder="Enter main topic for banner..."
													value={section.data.topic}
													onChange={(e) =>
														handleBannerTopicChange(section.id, e.target.value)
													}
												/>
											</div>
											<div className="input-group">
												<label
													htmlFor={`bannerTopic-${section.id}`}
													className="input-label"
												>
													Add Sub Topic
												</label>
												<input
													type="text"
													id={`bannerTopic-${section.id}`}
													className="text-input"
													placeholder="Enter bottom subtopic for banner..."
													value={section.data.subTopic}
													onChange={(e) =>
														handleBannerSubTopicChange(
															section.id,
															e.target.value
														)
													}
												/>
											</div>

											<div className="input-group">
												<label
													htmlFor={`bannerDescription-${section.id}`}
													className="input-label"
												>
													Add Description
												</label>
												<input
													type="text"
													id={`bannerDescription-${section.id}`}
													className="text-input"
													placeholder="Enter Bottom Description for banner..."
													value={section.data.description}
													onChange={(e) =>
														handleBannerDescriptionChange(
															section.id,
															e.target.value
														)
													}
												/>
											</div>

											<div className="input-group">
												<label
													htmlFor={`bannerCaption-${section.id}`}
													className="input-label"
												>
													Add Caption
												</label>
												<input
													type="text"
													id={`bannerCaption-${section.id}`}
													className="text-input"
													placeholder="Enter caption for banner..."
													value={section.data.caption}
													onChange={(e) =>
														handleBannerCaptionChange(
															section.id,
															e.target.value
														)
													}
												/>
											</div>
											<div className="image-upload-area">
												<span className="image-upload-label">Add Image</span>
												<input
													type="file"
													ref={(el) => (fileInputRefs.current[section.id] = el)}
													style={{ display: "none" }}
													accept="image/*"
													onChange={(e) =>
														handleBannerImageSelect(section.id, e)
													}
												/>
												<button
													onClick={() => triggerBannerFileInput(section.id)}
													className="choose-image-button"
													disabled={(section.data.images || []).length >= 2}
												>
													Choose Image
												</button>
												<span className="image-limit-text">
													Max 2 selected: ({(section.data.images || []).length}
													/2)
												</span>
												<div className="image-previews">
                          {(section.data.images || []).map((imgData, imgIndex) => (
        <div key={imgIndex} className="image-preview-item">
            <img
                src={imgData.previewUrl || imgData} // Use previewUrl for new files, or imgData (the URL) for existing ones
                alt={`Banner Image ${imgIndex + 1}`}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/100x100/FF0000/FFFFFF?text=Error";
                }}
            />
            <button
																onClick={() =>
																	handleBannerRemoveImage(section.id, imgIndex)
																}
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
										</>
									)}
									{section.type === "three-columns" && (
										<>
											<div className="input-group">
												<label
													htmlFor={`3columns-layout-${section.id}`}
													className="input-label"
												>
													Add Topic
												</label>
												<input
													type="text"
													id={`3columns-layout-Topic-${section.id}`}
													className="text-input"
													placeholder="Enter main topic for 3 Columns section..."
													value={section.data.topic}
													onChange={(e) =>
														handleThreeColumnsTopicChange(
															section.id,
															e.target.value
														)
													}
												/>
											</div>
											<div className="input-group">
												<label
													htmlFor={`3columns-layout-className-${section.id}`}
													className="input-label"
												>
													Add Classname
												</label>
												<input
													type="text"
													id={`3columns-layout-${section.id}`}
													className="text-input"
													placeholder="Enter a className for 3 Columns section..."
													value={section.data.className}
													onChange={(e) =>
														handleThreeColumnsClassNameChange(
															section.id,
															e.target.value
														)
													}
												/>
											</div>
											<div className="input-group">
												<label
													htmlFor={`exploreDescription-${section.id}`}
													className="input-label"
												>
													Add Description
												</label>
												<textarea
													id={`exploreDescription-${section.id}`}
													className="text-input"
													rows="4"
													placeholder="Enter a description for the 3 Columns section..."
													value={section.data.description}
													onChange={(e) =>
														handleThreeColumnsDescriptionChange(
															section.id,
															e.target.value
														)
													}
												></textarea>
											</div>
											<div className="subform-section">
												<div className="subform-header">
													<h3>Column (Max 3)</h3>
													<button
														onClick={() =>
															handleThreeColumnsAddColumn(section.id)
														}
														className="add-subform-button"
														disabled={(section.data.subforms || []).length >= 3}
													>
														+ Add Column
													</button>
												</div>
												{(section.data.subforms || []).map(
													(subform, subformIndex) => (
														<div key={subform.id} className="subform-card">
															<button
																onClick={() =>
																	handleThreeColumnsRemoveSubform(
																		section.id,
																		subform.id
																	)
																}
																className="remove-subform-button"
																aria-label="Remove subform"
																title="Remove this subform"
															>
																<svg
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
															<div className="input-group">
																<label
																	htmlFor={`subformTitle-${subform.id}`}
																	className="input-label"
																>
																	Title
																</label>
																<input
																	type="text"
																	id={`subformTitle-${subform.id}`}
																	className="text-input"
																	placeholder="Enter subform title..."
																	value={subform.title}
																	onChange={(e) =>
																		handleThreeColumnsSubformInputChange(
																			section.id,
																			subform.id,
																			"title",
																			e.target.value
																		)
																	}
																/>
															</div>

															<div className="input-group">
																<label
																	htmlFor={`subformDescription-${subform.id}`}
																	className="input-label"
																>
																	Description
																</label>
																<textarea
																	id={`subformDescription-${subform.id}`}
																	className="text-input"
																	rows="2"
																	placeholder="Enter a description..."
																	value={subform.description}
																	onChange={(e) =>
																		handleThreeColumnsSubformInputChange(
																			section.id,
																			subform.id,
																			"description",
																			e.target.value
																		)
																	}
																></textarea>
															</div>

															<div className="input-group">
																<label className="input-label">Image</label>
																<input
																	type="file"
																	id={`subformImage-${subform.id}`}
																	style={{ display: "none" }}
																	accept="image/*"
																	onChange={(e) =>
																		handlethreeColumnsSubformImageSelect(
																			section.id,
																			subform.id,
																			e
																		)
																	}
																/>
																<div className="image-subform-wrapper">
																	<button
																		onClick={() =>
																			document
																				.getElementById(
																					`subformImage-${subform.id}`
																				)
																				.click()
																		}
																		className="choose-image-button"
																	>
																		Choose Image
																	</button>
																	{subform.image && (
																		<div className="image-preview-item">
																			<img src={subform.image} alt="Subform" />
																			<button
																				onClick={() =>
																					handleThreeColumnsSubformInputChange(
																						section.id,
																						subform.id,
																						"image",
																						null
																					)
																				}
																				className="remove-image-button"
																				aria-label="Remove image"
																			>
																				<svg
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
																	)}
																</div>
															</div>
														</div>
													)
												)}
											</div>
										</>
									)}

									{/* New: Four-Columns Section JSX */}
									{section.type === "four-columns" && (
										<>
											<div className="input-group">
												<label
													htmlFor={`fourColumnsTopic-${section.id}`}
													className="input-label"
												>
													Add Topic
												</label>
												<input
													type="text"
													id={`fourColumnsTopic-${section.id}`}
													className="text-input"
													placeholder="Enter main topic for 4 Columns section..."
													value={section.data.topic}
													onChange={(e) =>
														handleFourColumnsTopicChange(
															section.id,
															e.target.value
														)
													}
												/>
											</div>
											<div className="input-group">
												<label
													htmlFor={`fourColumnsDescription-${section.id}`}
													className="input-label"
												>
													Add Description
												</label>
												<textarea
													id={`fourColumnsDescription-${section.id}`}
													className="text-input"
													rows="4"
													placeholder="Enter a description for the 4 Columns section..."
													value={section.data.description}
													onChange={(e) =>
														handleFourColumnsDescriptionChange(
															section.id,
															e.target.value
														)
													}
												></textarea>
											</div>

											{/* Subform Section */}
											<div className="subform-section">
												<div className="subform-header">
													<h3>Column (Max 4)</h3>
													<button
														onClick={() =>
															handleFourColumnsAddColumn(section.id)
														}
														className="add-subform-button"
														disabled={(section.data.subforms || []).length >= 4}
													>
														+ Add Column
													</button>
												</div>
												{(section.data.subforms || []).map(
													(subform, subformIndex) => (
														<div key={subform.id} className="subform-card">
															<button
																onClick={() =>
																	handleFourColumnsRemoveSubform(
																		section.id,
																		subform.id
																	)
																}
																className="remove-subform-button"
																aria-label="Remove subform"
																title="Remove this subform"
															>
																<svg
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
															<div className="input-group">
																<label
																	htmlFor={`subformTitle-${subform.id}`}
																	className="input-label"
																>
																	Title
																</label>
																<input
																	type="text"
																	id={`subformTitle-${subform.id}`}
																	className="text-input"
																	placeholder="Enter column title..."
																	value={subform.title}
																	onChange={(e) =>
																		handleFourColumnsSubformInputChange(
																			section.id,
																			subform.id,
																			"title",
																			e.target.value
																		)
																	}
																/>
															</div>
															<div className="input-group">
																<label
																	htmlFor={`subformLink-${subform.id}`}
																	className="input-label"
																>
																	Link
																</label>
																<input
																	type="text"
																	id={`subformLink-${subform.id}`}
																	className="text-input"
																	placeholder="Enter link..."
																	value={subform.link}
																	onChange={(e) =>
																		handleFourColumnsSubformInputChange(
																			section.id,
																			subform.id,
																			"link",
																			e.target.value
																		)
																	}
																/>
															</div>
															<div className="input-group">
																<label className="input-label">Image</label>
																<input
																	type="file"
																	id={`subformImage-${subform.id}`}
																	style={{ display: "none" }}
																	accept="image/*"
																	onChange={(e) =>
																		handleFourColumnsSubformImageSelect(
																			section.id,
																			subform.id,
																			e
																		)
																	}
																/>
																<div className="image-subform-wrapper">
																	<button
																		onClick={() =>
																			document
																				.getElementById(
																					`subformImage-${subform.id}`
																				)
																				.click()
																		}
																		className="choose-image-button"
																	>
																		Choose Image
																	</button>
																	{subform.image && (
																		<div className="image-preview-item">
																			<img src={subform.image} alt="Subform" />
																			<button
																				onClick={() =>
																					handleFourColumnsSubformInputChange(
																						section.id,
																						subform.id,
																						"image",
																						null
																					)
																				}
																				className="remove-image-button"
																				aria-label="Remove image"
																			>
																				<svg
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
																	)}
																</div>
															</div>
														</div>
													)
												)}
											</div>
										</>
									)}

									{/* New: BigBannerWithTextCard Section JSX */}
									{section.type === "big-banner-with-text-card" && (
										<>
											<div className="input-group">
												<label
													htmlFor={`bannerTopic-${section.id}`}
													className="input-label"
												>
													Add Topic
												</label>
												<input
													type="text"
													id={`bannerTopic-${section.id}`}
													className="text-input"
													placeholder="Enter a topic..."
													value={section.data.topic}
													onChange={(e) =>
														handleBigBannerWithTextCardTopicChange(
															section.id,
															e.target.value
														)
													}
												/>
											</div>
											<div className="input-group">
												<label
													htmlFor={`bannerDescription-${section.id}`}
													className="input-label"
												>
													Add Description
												</label>
												<textarea
													id={`bannerDescription-${section.id}`}
													className="text-input"
													rows="4"
													placeholder="Enter a description..."
													value={section.data.description}
													onChange={(e) =>
														handleBigBannerWithTextCardDescriptionChange(
															section.id,
															e.target.value
														)
													}
												></textarea>
											</div>
											<div className="input-group">
												<label className="input-label">Big Image</label>
												<input
													type="file"
													id={`bigImage-${section.id}`}
													style={{ display: "none" }}
													accept="image/*"
													onChange={(e) =>
														handleBigBannerWithTextCardImageSelect(
															section.id,
															e
														)
													}
												/>
												<div className="image-subform-wrapper">
													<button
														onClick={() =>
															document
																.getElementById(`bigImage-${section.id}`)
																.click()
														}
														className="choose-image-button"
													>
														Choose Image
													</button>
													{section.data.bigImage && (
														<div className="image-preview-item">
															<img
																src={section.data.bigImage}
																alt="Big Banner"
															/>
															<button
																onClick={() =>
																	setAddedSections((prev) =>
																		prev.map((s) =>
																			s.id === section.id
																				? {
																						...s,
																						data: { ...s.data, bigImage: null },
																				  }
																				: s
																		)
																	)
																}
																className="remove-image-button"
																aria-label="Remove image"
															>
																<svg
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
													)}
												</div>
											</div>
											<div className="input-group">
												<label
													htmlFor={`imageCaption-${section.id}`}
													className="input-label"
												>
													Image Caption
												</label>
												<input
													type="text"
													id={`imageCaption-${section.id}`}
													className="text-input"
													placeholder="Enter image caption..."
													value={section.data.imageCaption}
													onChange={(e) =>
														handleBigBannerWithTextCardImageCaptionChange(
															section.id,
															e.target.value
														)
													}
												/>
											</div>
										</>
									)}

									{section.type === "trip" && (
										<p className="default-content-text">
											Content for the Trip section (ID: {section.id}) goes here.
											You might add fields for destination, dates, etc.
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				)}
				<div className="section-selector-card">
					<label htmlFor="selectSection" className="section-selector-label">
						Add Sections:
					</label>
					<select
						id="selectSection"
						className="section-select"
						value={selectedSectionType}
						onChange={(e) => setSelectedSectionType(e.target.value)}
					>
						<option value="">-- Select Section Type --</option>
						<option value="banner">Add Banner Section</option>
						<option value="big-banner-with-text-card">
							Add BigBanner with Text Card Section
						</option>
						<option value="three-columns">Add 3 Columns section</option>
						<option value="four-columns">Add 4 Columns section</option>
						<option value="trip">Add Trip Section</option>
					</select>
					<button
						onClick={handleAddSection}
						className="add-section-button"
						disabled={!selectedSectionType}
					>
						Add Section
					</button>
				</div>
				<div className="save-page-container">
					<button onClick={handleSavePage} className="save-page-button">
						Save Page
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddDynamicPage;
