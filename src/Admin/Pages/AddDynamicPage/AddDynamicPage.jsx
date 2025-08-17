import React, { useState, useRef } from 'react'; // Added useRef for file input reference
import './AddDynamicPage.css'; // Assuming you have a CSS file for styling
// AddDynamicPage component to encapsulate the entire page creation form
const AddDynamicPage = () => {
  // State for the page title input
  const [pageTitle, setPageTitle] = useState('');
  // State to manage the type of section currently selected from the dropdown to be added
  const [selectedSectionType, setSelectedSectionType] = useState('');
  // State to store all dynamically added sections
  // Each item will be an object like: { id: 'uniqueId', type: 'banner', data: { topic: '', images: [] } }
  const [addedSections, setAddedSections] = useState([]);

  // Refs for each banner section's file input, allowing programmatic click
  const fileInputRefs = useRef({});

  // Function to handle changes in the main topic for a specific banner section
  const handleBannerTopicChange = (id, newTopic) => {
    setAddedSections(prevSections =>
      prevSections.map(section =>
        section.id === id && section.type === 'banner'
          ? { ...section, data: { ...section.data, topic: newTopic } }
          : section
      )
    );
  };

  // Function to trigger the hidden file input when "Choose Image" button is clicked
  const triggerFileInput = (id) => {
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id].click();
    }
  };

  // Function to handle image selection from the file input
  const handleImageSelect = (id, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (e.g., PNG, JPG, GIF).');
      return;
    }

    setAddedSections(prevSections =>
      prevSections.map(section => {
        if (section.id === id && section.type === 'banner') {
          const currentImages = section.data.images || [];
          if (currentImages.length < 2) {
            const reader = new FileReader();
            reader.onloadend = () => {
              // Add the Base64 data URL to the images array
              setAddedSections(currentSecs =>
                currentSecs.map(s =>
                  s.id === id ? { ...s, data: { ...s.data, images: [...currentImages, reader.result] } } : s
                )
              );
            };
            reader.readAsDataURL(file); // Read the file as a Base64 data URL
          } else {
            alert('Maximum 2 images already selected for this banner section.');
          }
        }
        return section;
      })
    );
    // Clear the input value so the same file can be selected again if needed
    event.target.value = '';
  };

  // Function to remove an image from a specific banner section
  const handleRemoveImage = (sectionId, imageIndex) => {
    setAddedSections(prevSections =>
      prevSections.map(section => {
        if (section.id === sectionId && section.type === 'banner') {
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

  // Function to add a section based on the selected type
  const handleAddSection = () => {
    if (selectedSectionType) {
      const newSection = {
        id: `section-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Unique ID
        type: selectedSectionType,
        data: {}, // Initialize with empty data; will be populated by sub-components
      };
      // Initialize data based on section type
      if (selectedSectionType === 'banner') {
        newSection.data = { topic: '', images: [] };
      } else {
        newSection.data = { content: '' }; // Generic content for other sections
      }
      setAddedSections(prevSections => [...prevSections, newSection]);
      setSelectedSectionType(''); // Reset dropdown after adding
    }
  };

  // Function to remove an entire section
  const handleRemoveSection = (idToRemove) => {
    setAddedSections(prevSections => prevSections.filter(section => section.id !== idToRemove));
  };


  // Function to handle saving the page (mock functionality)
  const handleSavePage = () => {
    const pageData = {
      id: `page-${Date.now()}`, // Generate a unique ID for demonstration
      title: pageTitle,
      sections: addedSections.map(section => ({
        id: section.id,
        type: section.type,
        data: section.data,
      })),
    };
    console.log('Saving Page Data:', pageData);
    alert('Page saved! Check console for data. ID: ' + pageData.id); // Using alert for demo
    // In a real application, you'd send `pageData` to a backend API.
    // Note: Storing base64 images directly in a database is generally not recommended for large images.
    // Usually, you'd upload images to cloud storage (e.g., Firebase Storage, AWS S3) and store their URLs.
  };

  return (
 <div className="app-container">
  

      <div className="form-card">
        <h1 className="main-title">
          Create New Page
        </h1>

        {/* Page Title Section */}
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

        {/* Dynamically Rendered Sections - Remains at the top */}
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                <div className="section-header">
                  <span className="section-title">
                    {index + 1}. {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                  </span>
                </div>
                <div className="section-content">
                  {section.type === 'banner' && (
                    <>
                      <label htmlFor={`bannerTopic-${section.id}`} className="input-label">
                        Add main Topic
                      </label>
                      <input
                        type="text"
                        id={`bannerTopic-${section.id}`}
                        className="text-input"
                        placeholder="Enter main topic for banner..."
                        value={section.data.topic}
                        onChange={(e) => handleBannerTopicChange(section.id, e.target.value)}
                      />
                      <div className="image-upload-area">
                        <span className="image-upload-label">Add Image</span>
                        <input
                          type="file"
                          ref={el => fileInputRefs.current[section.id] = el} // Assign ref to the input
                          style={{ display: 'none' }} // Hide the input
                          accept="image/*" // Accept only image files
                          onChange={(e) => handleImageSelect(section.id, e)}
                        />
                        <button
                          onClick={() => triggerFileInput(section.id)} // Trigger hidden input on button click
                          className="choose-image-button"
                          disabled={(section.data.images || []).length >= 2}
                        >
                          Choose Image
                        </button>
                        <span className="image-limit-text">
                          Max 2 selected: ({(section.data.images || []).length}/2)
                        </span>
                        <div className="image-previews">
                          {(section.data.images || []).map((src, imgIndex) => (
                            <div key={imgIndex} className="image-preview-item">
                              <img
                                src={src}
                                alt={`Banner Image ${imgIndex + 1}`}
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/FF0000/FFFFFF?text=Error"; }}
                              />
                              <button
                                onClick={() => handleRemoveImage(section.id, imgIndex)}
                                className="remove-image-button"
                                aria-label="Remove image"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {section.type === 'explore' && (
                    <p className="default-content-text">
                      Content for the Explore section (ID: {section.id}) goes here. You can add more inputs or rich text editors.
                    </p>
                  )}

                  {section.type === 'trip' && (
                    <p className="default-content-text">
                      Content for the Trip section (ID: {section.id}) goes here. You might add fields for destination, dates, etc.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Selector and Add Button - Moved to bottom */}
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
            <option value="explore">Add Explore Section</option>
            <option value="trip">Add Trip Section</option>
          </select>
          <button
            onClick={handleAddSection}
            className="add-section-button"
            disabled={!selectedSectionType} // Disable if no section type is selected
          >
            Add Section
          </button>
        </div>


        {/* Save Page Button */}
        <div className="save-page-container">
          <button
            onClick={handleSavePage}
            className="save-page-button"
          >
            Save Page
          </button>
          <p className="save-page-hint">
            Page should be Saved with an ID (check console after saving).
          </p>
        </div>
      </div>
    </div>

  );
};

export default AddDynamicPage;
