import React, { FC } from 'react'
import { Field, Form, Formik, FormikProps } from 'formik';
import { Form as TeaForm, FormItemProps } from "tea-component/lib/form";
import { Input, InputProps } from "tea-component/lib/input";

type CustomInputProps = Partial<InputProps> & Pick<FormItemProps, "label" | "name"> & {
  
}

export const CustomInput:FC<CustomInputProps> = props => {
  return (
    <Field>
      {
        () => {
          return (
            <TeaForm.Item label="姓名" status="success">
              <Input placeholder="你是谁" />
            </TeaForm.Item>
          )
        }
      }
    </Field>
  )
}