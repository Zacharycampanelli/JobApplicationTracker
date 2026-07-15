import React from 'react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'

const Test = () => {
  return (<div className='m-10'>
    <div><Button variant='primary'>1</Button></div>
    <div><Button variant='secondary'>2</Button></div>
    <div><Button variant='ghost'>3</Button></div>
    <div><Button variant='danger'>4</Button></div>
<Input placeholder='testing' type="password"/>
<Select options={[{label:'1', value:'1'}]} placeholder='Select one'/>
  </div>)
}

export default Test