import React from 'react'
import { Select, Spin } from 'antd'

import axios from 'axios'
import debounce from 'lodash/debounce'

const { Option } = Select

interface Select2Props {
  value?: string,
  url: string,
  requestName: string,
  subjoin: string,
  form: any,
  onChange?: any
}

interface Select2States {
  value: string,
  fetching: boolean,
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
    this.onSearch = debounce(this.onSearch, 800)
    this.state = {
      value: props.value,
      fetching: false,
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

  private search = async (value) => {
    const { subjoin, form } = this.props
    let subjoinParams = {}
    if (subjoin) {
      const subjoinArr = subjoin.split(' ')
      if (subjoinArr && subjoinArr.length == 2) {
        const values = form.getFieldsValue()
        const searchKey = subjoinArr[0]
        const controlKey = subjoinArr[1]
        subjoinParams[searchKey] = values[controlKey]
      }
    }
    const { url, requestName } = this.state
    const params = {
      [requestName]: value,
      ...subjoinParams
    }
    const { token, base_url } = this.qs
    let searchURL = ''
    if (this.regURL.test(url)) {
      searchURL = url
    } else {
      searchURL = `${base_url}${url}`
    }
    this.setState({ fetching: true })
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
    this.setState({ fetching: false })
  }

  private onSearch = (value) => {
    if (value === '') {
      return
    }
    this.search(value)
  }

  private onDropdownVisibleChange = (visible) => {
    if (visible) {
      this.search('')
    }
  }

  public render () {
    const { fetching, options } = this.state
    const { value } = this.props
    return (
      <Select
        showSearch
        allowClear
        value={value}
        placeholder="请输入"
        notFoundContent={fetching ? <Spin size="small" /> : '暂无数据'}
        filterOption={false}
        defaultActiveFirstOption={false}
        onChange={this.props.onChange}
        onSearch={this.onSearch}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
      >
        {options.map((o) => {
          return <Option key={o.id} value={o.id}>{o.name}</Option>
        })}
      </Select>
    )
  }
}

export default Select2
