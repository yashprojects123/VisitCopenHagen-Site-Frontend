import * as yup from "yup";

export const DynamicSectionSchemas = {
  banner: {
    label: "Banner Section",
    fields: [
      { name: "mainTopic", label: "Main Topic", type: "text" },
      { name: "subTopic", label: "Sub Topic", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "caption", label: "Caption", type: "text" },
      {
        type: "array",
        itemType: "image",
        name: "images",
        label: "Banner Images",
        max: 2,
        multiple: true,
      },
    ],
  },
  big_banner_with_text_card: {
    label: "Big Banner with Text Card",
    fields: [
      { name: "topic", label: "Topic", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "caption", label: "Caption", type: "text" },
      { name: "image", label: "Full width banner image", type: "file" },
    ],
  },
  gallery: {
    label: "Image Gallery",
    fields: [
      {
        name: "images",
        type: "array",
        itemType: "image",
        max: 5,
      },
    ],
  },
  threeColumns: {
    label: "Three Columns Section",
    fields: [
      { name: "topic", label: "Topic", type: "text" },
      { name: "className", label: "Class Name", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "columns",
        label: "Columns",
        type: "array",
        max: 3,
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "desc", label: "Description", type: "textarea" },
          { name: "image", label: "Image", type: "file" },
        ],
      },
    ],
  },
  fourColumns: {
    label: "Four Columns Section",
    fields: [
      { name: "topic", label: "Topic", type: "text" },
      { name: "className", label: "Class Name", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "columns",
        label: "Columns",
        type: "array",
        max: 4,
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "desc", label: "Description", type: "textarea" },
          { name: "image", label: "Image", type: "file" },
        ],
      },
    ],
  },
};

export const getValidationSchema = () =>
  yup.object().shape({
    title: yup.string().required("Page title is required"),
    slug: yup.string().required("Slug is required"), // ✅ Added
    sections: yup
      .array()
      .of(
        yup.object().shape({
          type: yup
            .string()
            .required("Section type is required"),
        })
      )
      .min(1, "At least one section is required"),
  });
