import {EnhancedClass,Type, Base, Column, Form} from './utils'
import * as Yup from 'yup';

@EnhancedClass({})
export class Person extends Base {

  static sexOptions = ['male' , 'female' , 'unknow'];

  @Type({
    handle: 'ID'
  })
  id: number = 0

  @Form({
    label:"Name",
    validationSchema: Yup.string().required('Name is required'),
    handleSubmitData(data,key) {
      return {
        [key]: (data[key] as string).toUpperCase()
      }
    },
    required: true,
    initValue:'test name'
  })
  @Column({
    header: 'person name'
  })
  @Type({})
  name:string = ''

  @Form({
    label:"Age",
    validationSchema: Yup.string().required('Age is required'),
    handleSubmitData(data,key) {
      return {
        [key]: parseInt(data[key] || '0')
      }
    },
    required: true,
  })
  @Column({
    header: 'person age'
  })
  @Type({
    handle(data,key)  {
      return parseInt(data[key] || '0')
    }
  })
  age:number = 0

  @Form({
    label:"Sex",
    options: Person.sexOptions
  })
  @Column({})
  @Type({
    handle(data,key)  {
      return Person.sexOptions.includes(data[key]) ? data[key] : 'unknow'
    }
  })
  sex: 'male' | 'female' | 'unknow' = 'unknow'
}