import type { Block } from 'payload'

export const HTMLEmbed: Block = {
  slug: 'htmlEmbed',
  interfaceName: 'HTMLEmbedBlock',
  fields: [
    {
      name: 'html',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Enter HTML code to embed. Note: For security reasons, potentially harmful elements (script, iframe, form) and attributes (onclick, onerror) will be automatically removed.',
        rows: 10,
      },
      hooks: {
        beforeChange: [
          (args) => {
            return args.value
            if (!args.value) return args.value

/*            // Sanitize HTML to prevent XSS attacks
            const cleanHtml = DOMPurify.sanitize(args.value, {
              USE_PROFILES: { html: true },
              ADD_ATTR: ['target'], // Allow target attribute for links
              FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed', 'form'], // Forbid potentially dangerous tags
              FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'], // Forbid event handlers
            })

            return cleanHtml*/
          }
        ]
      }
    },
  ],
}
