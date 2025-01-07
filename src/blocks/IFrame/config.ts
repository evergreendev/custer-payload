import {Block} from "payload";

export const IFrame: Block = {
    slug: "IFrame",
    fields: [
        {
            name: "containerStyle",
            type: "textarea",
        },
        {
            name: "fields",
            type: "array",
            fields: [
                {
                    type: "text",
                    name: "property",
                    required: true
                },
                {
                    type: "text",
                    name: "value"
                }
            ]
        }
    ]
}

export default IFrame;
