import {Block} from "payload";

export const FileUpload: Block = {
  slug: "fileUpload",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: 'name',
          label: 'Name (lowercase, no special characters)',
          required: true,
          type: 'text',
          admin: {width: '50%'}
        },
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          admin: {width: '50%'}
        }
      ]
    },
    {name: 'width', label: 'Field Width (percentage)', type: 'number'},
    {name: 'required', label: 'Required', type: 'checkbox'},
    {name: 'maxSize', label: 'Max Size (MB) default 25mb', type: 'number'},
    {
      name: 'fileTypes',
      type: 'select',
      hasMany: true,
      options: [
        "Images",
        "Video",
        "PDF",
        "WordDocs"
      ]
    }
  ]
}

export default FileUpload;
