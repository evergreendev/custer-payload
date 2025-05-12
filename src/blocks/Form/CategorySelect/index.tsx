'use client'
import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect, useRef } from 'react'
import { Controller } from 'react-hook-form'
import FuzzySearch from 'fuzzy-search'

import { Error } from '../Error'
import { Width } from '../Width'

export const CategorySelect: React.FC<
  SelectField & {
  categories: {title: string, id: string}[]
    control: Control<FieldValues, any>
    errors: Partial<
      FieldErrorsImpl<{
        [x: string]: any
      }>
    >
  }
> = ({ name, control, errors, label, categories, required, width }) => {
  return (
    <Width width={width}>
      <Label htmlFor={name}>{label}</Label>
      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange, value } }) => {
          const [inputValue, setInputValue] = useState(value || '')
          const [isDropdownOpen, setIsDropdownOpen] = useState(false)
          const [filteredCategories, setFilteredCategories] = useState(categories)
          const dropdownRef = useRef<HTMLDivElement>(null)

          // Close dropdown when clicking outside
          useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
              if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
              }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
              document.removeEventListener('mousedown', handleClickOutside)
            }
          }, [])

          // Filter categories when input value changes
          useEffect(() => {
            if (inputValue.trim() === '') {
              setFilteredCategories(categories)
            } else {
              const searcher = new FuzzySearch(categories, ['title'])
              const results = searcher.search(inputValue)
              setFilteredCategories(results)
            }
          }, [inputValue, categories])

          const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value
            setInputValue(newValue)
            setIsDropdownOpen(true)
          }

          const handleSelectCategory = (title: string) => {
            setInputValue(title)
            onChange(title)
            setIsDropdownOpen(false)
          }

          const handleInputBlur = () => {
            // Allow creating a new category if it doesn't exist
            if (inputValue.trim() !== '') {
              onChange(inputValue)
            }
          }

          return (
            <div className="relative" ref={dropdownRef}>
              <Input
                id={name}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={handleInputBlur}
                placeholder={label}
                className="w-full"
              />
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCategories.length > 0 ? (
                    <ul className="py-1">
                      {filteredCategories.map(({ title, id }) => (
                        <li
                          key={id}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSelectCategory(title)}
                        >
                          {title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <button onClick={(e)=>{
                      e.preventDefault();
                      setIsDropdownOpen(false);
                    }} className="px-3 py-2 text-sm text-gray-500">
                      {inputValue.trim() !== '' ?
                        `No matches found. Add new category: "${inputValue}".` :
                        'No categories found.'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        }}
        rules={{ required }}
      />
      {required && errors[name] && <Error />}
    </Width>
  )
}
