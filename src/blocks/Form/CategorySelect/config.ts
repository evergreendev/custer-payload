import { Block, Field } from 'payload'


const name: Field = {
  name: 'name',
  label: 'Name (lowercase, no special characters)',
  type: 'text',
  required: true,
}

const label: Field = {
  name: 'label',
  label: 'Label',
  type: 'text',
  localized: true,
}

const width: Field = {
  name: 'width',
  label: 'Field Width (percentage)',
  type: 'number',
}

export const CategorySelect: Block = {
  slug: 'categorySelect',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          label: 'Default Value',
          localized: true,
          type: 'text',
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}
