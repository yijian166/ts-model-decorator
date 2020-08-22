import "reflect-metadata";
import React, { Component, useEffect, useState, useCallback } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';
import { Person } from "./person.service";
import { getPersonFromServer, getPersonListFromServer } from "./person.api";
import Table from "./Table";
import "tea-component/lib/tea.css";
import { PageParams } from "./utils";
import { Button } from "tea-component/lib/button";
import { PersonForm } from './PersonForm'

const App = () => {
  const [person,setPerson] = useState<Person | null>(null)

  const columns = Person.getColumns<Person>();

  const getListFun = useCallback((param: PageParams) => {
    return Person.getList<Person>(param)
  }, [])
  
  return (
    <div style={{padding:10}}>
      <Button type="primary" >Add</Button>
      <div style={{padding: 20, marginBottom: 40}}>
        <PersonForm />
      </div>
      <Table<Person> columns={columns} getListFun={getListFun}/>
    </div>
    )
}

render(<App />, document.getElementById('root'));
