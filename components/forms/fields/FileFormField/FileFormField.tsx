import { Field } from 'formik'
import React, { createRef, useEffect, useState } from 'react'
import { RiErrorWarningFill } from 'react-icons/ri'
import { FIELD_CLASS_NAME } from '../../../../constants/formConstants'
import { ImCloudUpload } from 'react-icons/im'
import { IoMdCloseCircle } from 'react-icons/io'

interface Props {
   readonly name: string
   readonly label: string
   readonly values: any
   readonly id?: string
   readonly className?: string
   readonly containerClassName?: string
   readonly error?: string | undefined
   readonly touched?: boolean | undefined
}

const FileFormField: React.FC<Props> = ({
   name,
   label,
   id,
   className,
   containerClassName,
   values,
   error,
   touched
}) => {
   const [fileUrl, setFileUrl] = useState<string | undefined>(undefined)
   const [file, setFile] = useState<File | undefined>(undefined)
   const inputRef = createRef<HTMLInputElement>()

   useEffect(() => {
      if (values && values[name] && fileUrl !== values[name] && typeof values[name] === 'string') {
         setFileUrl(values[name])
      }
   }, [values])

   const errorStyle = error && touched ? 'border-2 border-red-400' : ''

   return (
      <div className={`${containerClassName} flex flex-col`}>
         <label className='text-white' htmlFor={id}>
            {label}
         </label>
         <Field
            name={name}
         >
            {
               ({ form }: any) => (
                  <>
                     <label className={`
                        ${FIELD_CLASS_NAME} ${className} ${errorStyle} rounded bg-white w-44 flex gap-3 cursor-pointer
                     `}>
                        <input
                           ref={inputRef}
                           type='file'
                           className='hidden'
                           onChange={ev => {
                              const value = ev.target.files && ev.target.files[0]
                              setFile(value as File)
                              form.setFieldValue(name, value)
                           }}
                        />
                        {!file && <><ImCloudUpload size={22} /> Escolha Imagem</>}
                        {file && <><ImCloudUpload size={22} /> Feito</>}
                     </label>
                     {file &&
                        <div 
                           className="text-gray-300 py-2 cursor-pointer w-fit"
                           onClick={() => {
                              if (inputRef.current) inputRef.current.value = ''
                              setFile(undefined)
                              form.setFieldValue(name, undefined)
                           }}
                        >
                           <div className='flex gap-2'>
                              <IoMdCloseCircle size={20} />
                              {file.name}
                           </div>
                        </div>
                     }
                     {fileUrl &&
                        <div className="mt-2 relative border-2 inline w-fit">
                           <img className='w-20 h-auto' src={fileUrl}/>
                           <span
                              className='absolute -top-2 -right-3 text-gray-200 rounded-full bg-black cursor-pointer'
                              onClick={() => {
                                 if (inputRef.current) inputRef.current.value = ''
                                 setFile(undefined)
                                 setFileUrl(undefined)
                                 form.setFieldValue(name, undefined)
                              }}
                           >
                              <IoMdCloseCircle size={20} />
                           </span>
                        </div>
                     }
                  </>
               )
            }
         </Field>
         {error && touched && (
            <div className='text-gray-400 text-base flex gap-1'>
               <span className='translate-y-1'>
                  <RiErrorWarningFill />
               </span>
               {' '}
               {error}
            </div>
         )}
      </div>
   )
}

export default FileFormField
