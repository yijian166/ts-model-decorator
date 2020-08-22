import {TableColumn} from 'tea-component/lib/table'
import { getPersonListFromServer } from './person.api';
import { ReactNode } from 'react';
export interface EnhancedTableColumn<T> extends TableColumn<T> {}

type ServerHandle = (data:any,key:string) => any
export interface TypePropertyConfig {
  handle?: string | ServerHandle
}
export interface ColumnPropertyConfig extends Partial<EnhancedTableColumn<any>> {

}

export interface FormPropertyConfig {
  validationSchema?: any;
  label?: string;
  handleSubmitData?: (data:any,key:string) => {[key:string]: any},
  required?: boolean;
  initValue?: any;
  options?: string[]
}

export type FormItemConfigType<T extends any> = {
  [key in keyof T]: {
    validationSchema?: any;
    handleSubmitData?: FormPropertyConfig['handleSubmitData'];
    form: {
      label: string;
      name: string;
      required: boolean;
      message?: string;
      options: string[];
    };
  };
};

export interface ConstructableFunction {
  new(params?:any): ConstructableFunction;
}

export interface ClassConfig {

}

export interface PageParams {
  pageIndex: number;
  pageSize: number;
}

export interface Paginabale<T> {
  total: number;
  list: T[]
}
/**
 * offer types
 */
export abstract class Base {
  static getColumns<T>(): EnhancedTableColumn<T>[] {
    return []
  }

  static async getList<T>(params: PageParams): Promise<Paginabale<T>> {
    return {total: 0, list:[]}
  }


  static getFormInitValues<T>(item?: T): Partial<T> {
    return {}
  }

  static getFormItemConfig<T>(overwriteConfig?: { [key: string]: any; }):  FormItemConfigType<T> {
      return {} as FormItemConfigType<T> 
  }

  static handleToFormData<T>(item: T) {}
}

function CreateProperDecoratorF<T>() {
  const metaKey = Symbol();
  function properDecoratorF(config:T): PropertyDecorator {
    return function (target, key) {
      Reflect.defineMetadata(metaKey, config, target, key);
    };
  }
  return { metaKey, properDecoratorF}
}

function getConfigMap<T>(F: any, cachekey: symbol,metaKey: symbol): Map<string,T> {
  if (F[cachekey]) {
    return F[cachekey]!;
  }
  const item = new F({});
  F[cachekey] = Object.keys(item).reduce((pre,cur) => {
    const config: T = Reflect.getMetadata(
      metaKey,
      item,
      cur
    );
    if (config) {
      pre.set(cur, config);
    }
    return pre
  }, new Map<string, T>());
  return F[cachekey];
}

const typeConfig = CreateProperDecoratorF<TypePropertyConfig>()
export const Type = typeConfig.properDecoratorF;

const columnConfig = CreateProperDecoratorF<ColumnPropertyConfig>()
export const Column = columnConfig.properDecoratorF

const formConfig = CreateProperDecoratorF<FormPropertyConfig>()
export const Form = formConfig.properDecoratorF

export function EnhancedClass(config: ClassConfig):any {
  const cacheColumnConfigKey = Symbol('cacheColumnConfigKey'); 
  const cacheTypeConfigkey = Symbol('cacheTypeConfigkey');
  return function(Target) {
    return class EnhancedClass extends Target {
      
      [cacheColumnConfigKey]: Map<string,ColumnPropertyConfig> | null
      /**
       * table column config
       */
      static get columnConfig(): Map<string,ColumnPropertyConfig> {
        return getConfigMap<ColumnPropertyConfig>(EnhancedClass, cacheColumnConfigKey,columnConfig.metaKey)
      }


      /**
       * get table colums
       */
      static getColumns<T>(): EnhancedTableColumn<T>[] {
        // console.log(11, EnhancedClass.columnConfig);
        const list :  EnhancedTableColumn<T>[] = []
        EnhancedClass.columnConfig.forEach((config, key) => {
          list.push({
            key,
            header: key,
            ...config
          })
        })

        return list
      }

      [cacheTypeConfigkey]: Map<string,FormPropertyConfig> | null
      /**
       * table column config
       */
      static get formConfig(): Map<string,FormPropertyConfig> {
        return getConfigMap<FormPropertyConfig>(EnhancedClass, cacheTypeConfigkey,formConfig.metaKey)
      }

      /**
       * get form init value
       */
      static getFormInitValues<T extends EnhancedClass>(item?: T): Partial<T> {
        const data:any  = {};
        const _item = new EnhancedClass({});
        EnhancedClass.formConfig.forEach((config,key) => {
          if (item && key in item) {
            data[key]  = item[key]
          } else if ('initValue' in config) {
            data[key]  = config.initValue
          } else {
            data[key] = _item[key] || ''
          }
        });
        return data as Partial<T>
      }

      static getFormItemConfig<T extends EnhancedClass>(overwriteConfig?: {
        [key: string]: any;
      }): FormItemConfigType<T> {
        const formConfig: any = {};
        EnhancedClass.formConfig.forEach((config,key) => {
          formConfig[key] = {
            form: {
              label: String(config.label || key),
              name: String(key),
              required: !!config.validationSchema,
              options: config.options || [],
              ...overwriteConfig
            }
          };
          if (config.validationSchema) {
            formConfig[key].validationSchema = config.validationSchema;
          }
          if (config.handleSubmitData) {
            formConfig[key].handleSubmitData = config.handleSubmitData;
          }
        })
        return formConfig as FormItemConfigType<T>
      }

      static handleToFormData<T extends EnhancedClass>(item: T) {
        let data = {}
        EnhancedClass.formConfig.forEach((config,key)=> {
          if (item.hasOwnProperty(key)) {
            data = {
              ...data,
              ...(EnhancedClass.formConfig
                .get(key).handleSubmitData ? EnhancedClass.formConfig
                .get(key).handleSubmitData(item, key) : {
                [key]: item[key] || ''
              })
            };
          }
          
        })
        return data
      }

      static async getList<T>(params: PageParams): Promise<Paginabale<T>> {
        const result = await getPersonListFromServer(params)
        return {
          total: result.count,
          list: result.data.map(item => new EnhancedClass(item))
        }
      }
      constructor(data) {
        super(data)
        Object.keys(this).forEach(key => {
          const config:TypePropertyConfig  =Reflect.getMetadata(typeConfig.metaKey,this,key)
          console.log(config)
          this[key] = config.handle ? typeof config.handle === 'string' ? data[config.handle]:config.handle(data,key): data[key];
        })
      }
    }
  }
}