import React, { FC } from 'react'
import { Field, Form, Formik, FormikProps } from 'formik';
import { Form as TeaForm, FormItemProps } from "tea-component/lib/form";
import { Input, InputProps } from "tea-component/lib/input";
import { Select } from 'tea-component/lib/select';

type CustomInputProps = Partial<InputProps> & Pick<FormItemProps, "label" | "name"> & {
  
}

type CustomSelectProps = Partial<InputProps> & Pick<FormItemProps, "label" | "name"> & {
  options: string[]
}

export const CustomInput:FC<CustomInputProps> = props => {
  // console.log('---CustomInput',props,props.name)
  return (
    <Field name={props.name}>
      {
        ({
          field, // { name, value, onChange, onBlur }
          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
          meta,
        }) => {
          return (
            <TeaForm.Item label={props.label} required={props.required} status={meta.touched &&  meta.error ? 'error': undefined } message={meta.error}>
              <Input type="text" {...field} onChange={(value,ctx)=> {
                // console.log('-=--',value,e)
                field.onChange(ctx.event)
              }} />
            </TeaForm.Item>
          )
        }
      }
    </Field>
  )
}

export const CustomSelect:FC<CustomSelectProps> = props => {
  // console.log('---CustomInput',props,props.name)
  return (
    <Field name={props.name}>
      {
        ({
          field, // { name, value, onChange, onBlur }
          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
          meta,
        }) => {
          return (
            <TeaForm.Item label={props.label} required={props.required} status={meta.touched &&  meta.error ? 'error': undefined } message={meta.error}>
              <Select  {...field} options={props.options.map(value=>({value}))} onChange={(value,ctx)=> {
                // console.log('-=--',value,e)
                field.onChange(ctx.event)
              }} />
            </TeaForm.Item>
          )
        }
      }
    </Field>
  )
}