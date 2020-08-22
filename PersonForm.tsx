import React, { FC } from 'react'
import { Field, Form, Formik, FormikProps } from 'formik';
import { Form as TeaForm } from "tea-component/lib/form";
import { CustomInput, CustomSelect } from './CustomFormField'
import { Person } from './person.service';
import * as Yup from 'yup';
import { Button } from "tea-component/lib/button";

export const PersonForm:FC<{
  onClose: () => void
}> = props => {
  const initialValues = Person.getFormInitValues<Person>()
  const formConfig = Person.getFormItemConfig<Person>();
  const schema = Object.entries(formConfig).reduce((pre, [key, value]) => {
    if (value.validationSchema) {
      pre[key] = value.validationSchema;
    }
    return pre;
  }, {});
  const validationSchema = Yup.object().shape(schema);
  
  function onSubmit(values) {
    const data = Person.handleToFormData(values);
    setTimeout(() => {
      console.log('---send to server', data)
      props.onClose()
    },10000)
  }
  return (
    <Formik 
      initialValues={initialValues} 
      onSubmit={onSubmit} 
      validationSchema={validationSchema}
    >
      {(formProps:FormikProps<any>) => {
        console.log('--formProps--',formProps,formConfig.name.form)
        return (
          <TeaForm >
            <CustomInput {...formConfig.name.form} />
            <CustomInput {...formConfig.age.form} />
            <CustomSelect {...formConfig.sex.form} />
            <Button type="primary" htmlType="submit" onClick={() => {
              formProps.submitForm()
            }} >Submit</Button>
          </TeaForm>
        )
      }}
    </Formik>
  )

}

