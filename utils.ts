import {TableColumn} from 'tea-component/lib/table'
import { getPersonListFromServer } from './person.api';
export interface EnhancedTableColumn<T> extends TableColumn<T> {}

type ServerHandle = (data:any,key:string) => any
export interface TypePropertyConfig {
  handle?: string | ServerHandle
}
export interface ColumnPropertyConfig extends Partial<EnhancedTableColumn<any>> {

}
export interface ConstructableFunction {
  new(params?:any): ConstructableFunction;
}

export interface ClassConfig {

}

const Typekey = Symbol('Typekey')
export function Type(config: TypePropertyConfig): PropertyDecorator {
  return function (target, key) {
    Reflect.defineMetadata(Typekey, config, target, key);
  };
}

const ColumnKey = Symbol('Columnkey')
export function Column(config: ColumnPropertyConfig): PropertyDecorator {
  return function (target, key) {
    Reflect.defineMetadata(ColumnKey, config, target, key);
  };
}

export interface PageParams {
  pageIndex: number;
  pageSize: number;
}

export interface Paginabale<T> {
  total: number;
  list: T[]
}
export abstract class Base {
  static getColumns<T>(): EnhancedTableColumn<T>[] {
    return []
  }

  static async getList<T>(params: PageParams): Promise<Paginabale<T>> {
    return {total: 0, list:[]}
  }
}


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
        const cachekey = cacheColumnConfigKey as unknown as string // avoid "Type 'unique symbol' cannot be used as an index type." error
        if (EnhancedClass[cachekey]) {
          return EnhancedClass[cachekey]!;
        }
        const item = new EnhancedClass({});
        EnhancedClass[cachekey] = Object.keys(item).reduce((pre,cur) => {
          const config: ColumnPropertyConfig = Reflect.getMetadata(
            ColumnKey,
            item,
            cur
          );
          if (config) {
            pre.set(cur, config);
          }
          return pre
        }, new Map<string, ColumnPropertyConfig>());
        return EnhancedClass[cachekey];
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
          const config:TypePropertyConfig  =Reflect.getMetadata(Typekey,this,key)
          console.log(config)
          this[key] = config.handle ? typeof config.handle === 'string' ? data[config.handle]:config.handle(data,key): data[key];
        })
      }
    }
  }
}