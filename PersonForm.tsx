import React from 'react'
import { Field, Form, Formik, FormikProps } from 'formik';
import { Form as TeaForm } from "tea-component/lib/form";
import { CustomInput } from './CustomFormField'

export const PersonForm = props => {
  function onSubmit() {

  }
  return (
    <Formik initialValues={{}} onSubmit={onSubmit}>
      {(formProps:FormikProps<any>) => {
        return (
          <TeaForm>
            <CustomInput />
          </TeaForm>
        )
      }}
    </Formik>
  )

}

