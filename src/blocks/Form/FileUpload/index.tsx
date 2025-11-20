import FieldError from '../FieldError'
import type { FieldValues, UseFormRegister } from 'react-hook-form'

type Errors = {
  message: string
  fieldName: string
} | null

const allowedFileDict = {
  Images: 'image/jpeg,image/png,image/gif,image/webp',
  Video: 'video/*',
  PDF: 'application/pdf',
  WordDocs:
    '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export const FileUpload = ({
  id,
  name,
  maxSize,
  errors,
  label,
  required: requiredFromProps,
  width,
  register,
  fileTypes,
}: {
  errors: Errors
  name: string
  label?: string | null
  width?: number | null
  required?: boolean | null
  register: UseFormRegister<FieldValues>
  id?: string | null
  maxSize?: number | null
  fileTypes?: ('Images' | 'Video' | 'PDF' | 'WordDocs')[] | null
}) => {
  return (
    <div
      key={id}
      className={`${errors?.fieldName === name ? 'border-2 border-dashed border-red-200' : ''} p-4 flex flex-col flex-wrap`}
      style={{ width: `${width || '100'}%` }}
    >
      {errors?.fieldName === name ? <FieldError message={errors.message} /> : ''}
      <label className="mr-2 font-opensans font-normal text-sm" htmlFor={name}>
        {label || name} {requiredFromProps ? '(required field)' : ''}{' '}
        {maxSize ? `(max upload size: ${maxSize}MB)` : '(max upload size: 25MB)'}
      </label>
      <div className="max-w-full mt-auto">
        <input
          className="border border-stone-300 p-1.5 bg-white rounded w-full"
          type="file"
          required={requiredFromProps || false}
          {...register(name, { required: requiredFromProps||false })}
          accept={fileTypes?.map((type) => allowedFileDict[type]).join(',')}
          id={name}
        />
      </div>
    </div>
  )
}
