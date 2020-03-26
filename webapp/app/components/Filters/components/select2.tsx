import React from 'react'
import { Select } from 'antd'

import axios from 'axios'
import debounce from 'lodash/debounce'

const { Option } = Select

interface Select2Props {
  value?: string,
  url: string,
  requestName: string,
  onChange?: any
}

interface Select2States {
  value: string,
  url: string,
  requestName: string,
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
      requestName: props.requestName,
      options: []
    }
  }

  private deep_set (o, path, value) {
    let i = 0
    for (; i < path.length - 1; i++) {
        if (o[path[i]] === undefined) {
          o[decodeURIComponent(path[i])] = path[i + 1].match(/^\d+$/) ? [] : {}
        }
        o = o[decodeURIComponent(path[i])]
    }
    o[decodeURIComponent(path[i])] = decodeURIComponent(value)
  }

  private querystring = (str) => {
    return str.split('&').reduce((o, kv) => {
      const [key, value] = kv.split('=')
      if (!value) {
          return o
      }
      this.deep_set(o, key.split(/[\[\]]/g).filter((x) => x), value)
      return o
    }, {})
  }

  private qs = this.querystring(location.href.substr(location.href.indexOf('?') + 1))

  private regURL = new RegExp('^((https|http)?://)')

  private onSearch = async (value) => {
    if (value === '') {
      return
    }
    const { url, requestName } = this.state
    const params = {
      [requestName]: value
    }
    const { token, base_url } = this.qs
    let searchURL = ''
    if (this.regURL.test(url)) {
      searchURL = url
    } else {
      searchURL = `${base_url}${url}`
    }
    const res = await axios.get(searchURL, {
      params,
      headers: {
        token
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
