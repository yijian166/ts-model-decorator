import { PageParams } from "./utils"

export const getPersonFromServer = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ID: 10,
        name: 'tyler',
        age: '20'
      })
    }, 1000)
  })
}

export const getPersonListFromServer = async (param: PageParams):any => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            ID: 10,
            name: 'tyler',
            age: '20',
            sex:'male'
          },
          {
            ID: 18,
            name: 'sopha',
            age: '18',
            sex:'female'
          }
        ],
        count: 2
      })
    }, 1000)
  })
}
