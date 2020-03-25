import React from 'react'
import { Select } from 'antd'

import axios from 'axios'
import debounce from 'lodash/debounce'

const { Option } = Select

interface Select2Props {
  value?: string,
  url: string,
  onChange?: any
}

interface Select2States {
  value: string,
  url: string,
  options: Array<{
    id: string,
    name: string
  }>
}

class Select2 extends React.Component<Select2Props, Select2States> {
  constructor (props) {
    super(props)
    this.onSearch = debounce(this.onSearch, 1000)
    this.state = {
      value: props.value,
      url: props.url,
      options: []
    }
  }

  private onSearch = async (value) => {
    const { url } = this.state
    const params = {
      limitCnt: 20,
      communityName: value
    }
    const res = await axios.get(url, {
      params,
      headers: {
        token: '85EDCD4D8F37D9C91C3728BC63023673'
      }
    })
    const { status, data } = res.data
    if (status === 100) {
      this.setState({ options: data })
    }
  }

  public render () {
    const { options } = this.state
    const { value } = this.props
    return (
      <Select
        showSearch
        allowClear
        value={value}
        placeholder="请输入"
        filterOption={false}
        defaultActiveFirstOption={false}
        onChange={this.props.onChange}
        onSearch={this.onSearch}
      >
        {options.map((o) => {
          return <Option key={o.id} value={o.id}>{o.name}</Option>
        })}
      </Select>
    )
  }
}

export default Select2
