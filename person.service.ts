import {EnhancedClass,Type, Base, Column} from './utils'
@EnhancedClass({})
export class Person extends Base {

  static sexOptions = ['male' , 'female' , 'unknow'];

  @Type({
    handle: 'ID'
  })
  id: number = 0

  @Column({
    header: 'person name'
  })
  @Type({})
  name:string = ''

  @Column({
    header: 'person age'
  })
  @Type({
    handle(data,key)  {
      return parseInt(data[key] || '0')
    }
  })
  age:number = 0

  @Column({})
  @Type({
    handle(data,key)  {
      return Person.sexOptions.includes(data[key]) ? data[key] : 'unknow'
    }
  })
  sex: 'male' | 'female' | 'unknow' = 'unknow'
}