/*
 * <<
 * Davinci
 * ==
 * Copyright (C) 2016 - 2017 EDP
 * ==
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * >>
 */

import React, { Suspense } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import classnames from 'classnames'

import { PlusOutlined } from '@ant-design/icons'

import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'

import { Row, Col, Input, InputNumber, Radio, Checkbox, Select, Button, Table } from 'antd'
import { FormComponentProps } from '@ant-design/compatible/lib/form/Form'


const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
let isSelectedTypeChanged = false

import { FilterTypeList, FilterTypesLocale, FilterTypes, FilterTypesDynamicDefaultValueSetting } from '../filterTypes'
import { renderDate, renderDateRange, renderDateRangeWithSize } from '..'
import { InteractionType } from '../types'
import {
  getOperatorOptions,
  getDatePickerFormatOptions,
  getDynamicDefaultValueOptions,
  getDynamicDefaultRangeValueOptions
} from '../util'
import DatePickerFormats, {
  DatePickerFormatsLocale,
  DatePickerDefaultValuesLocales,
  DatePickerRangeDefaultValuesLocales,
  DatePickerRangeDefaultValues,
  DatePickerDefaultValues
} from '../datePickerFormats'
import { setControlFormValues } from 'containers/Dashboard/actions'
import { makeSelectControlForm } from 'containers/Dashboard/selectors'

const utilStyles = require('assets/less/util.less')
const styles = require('../filter.less')

interface IFilterFormProps {
  form: any
  interactionType: InteractionType
  controlFormValues: any
  onControlTypeChange: (value) => void
  onSetControlFormValues: (values) => void
  onOpenOptionModal: () => void
}

export class FilterForm extends React.Component<IFilterFormProps, {}> {

  private renderDefaultValueComponent = () => {
    const { form, controlFormValues } = this.props
    const { getFieldDecorator } = form

    let container
    let type
    let multiple
    let showDefaultValue

    if (controlFormValues) {
      type = controlFormValues.type
      multiple = controlFormValues.multiple
      if (type === FilterTypes.Date) {
        showDefaultValue = controlFormValues.dynamicDefaultValue === DatePickerDefaultValues.Custom
      } else if (type === FilterTypes.DateRange) {
        showDefaultValue = controlFormValues.dynamicDefaultValue === DatePickerRangeDefaultValues.Custom
      }
    }

    switch (type) {
      case FilterTypes.DateRange:
        container = (
          <>
            <Col span={8}>
              <FormItem label="默认值">
                {getFieldDecorator('dynamicDefaultValue', {})(
                  <Select
                    size="small"
                    placeholder="默认值"
                    allowClear
                  >
                    {
                      getDynamicDefaultRangeValueOptions(type, multiple).map((val) => (
                        <Option key={val} value={val}>{DatePickerRangeDefaultValuesLocales[val]}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            {
              showDefaultValue && (
                <Suspense fallback={null}>
                  <Col span={14}>
                    <FormItem label=" " colon={false}>
                      {getFieldDecorator('defaultValue', {})(
                        renderDateRangeWithSize(controlFormValues, null, 'small')
                      )}
                    </FormItem>
                  </Col>
                </Suspense>
              )
            }
          </>
        )
        break
      case FilterTypes.Date:
        container = (
          <>
            <Col span={8}>
              <FormItem label="默认值">
                {getFieldDecorator('dynamicDefaultValue', {})(
                  <Select
                    size="small"
                    placeholder="默认值"
                    allowClear
                  >
                    {
                      getDynamicDefaultValueOptions(type, multiple).map((val) => (
                        <Option key={val} value={val}>{DatePickerDefaultValuesLocales[val]}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            {
              showDefaultValue && (
                <Suspense fallback={null}>
                  <Col span={8}>
                    <FormItem label=" " colon={false}>
                      {getFieldDecorator('defaultValue', {})(
                        renderDate(controlFormValues, null, {size: 'small'})
                      )}
                    </FormItem>
                  </Col>
                </Suspense>
              )
            }
          </>
        )
        break
      case FilterTypes.InputText:
        container = (
          <>
            <Col span={8}>
              <FormItem label="默认值">
                {getFieldDecorator('defaultValue', {})(
                  <Input size="small"  allowClear />
                )}
              </FormItem>
            </Col>
          </>
        )
        break
      case FilterTypes.Select:
        container = (
          <>
            <Col span={16}>
              <FormItem label="默认值">
                {getFieldDecorator('defaultValue', {})(
                  <Input size="small" />
                )}
              </FormItem>
            </Col>
          </>
        )
        break
    }
    // 控件类型发生改变重置默认值
    if (isSelectedTypeChanged === true) {
      controlFormValues.dynamicDefaultValue = undefined
      controlFormValues.defaultValue = undefined
      isSelectedTypeChanged = false
    }
    return container
  }

  public render () {
    const { form, interactionType, controlFormValues, onOpenOptionModal } = this.props
    const { getFieldDecorator } = form

    let type
    let operatorOptions
    let datePickerFormatOptions
    let customOptions
    let options
    const filterTypeRelatedInput = []

    if (controlFormValues) {
      const { type: t, multiple, customOptions: co, options: o } = controlFormValues
      type = t
      operatorOptions = getOperatorOptions(type, multiple)
      datePickerFormatOptions = getDatePickerFormatOptions(type, multiple)
      customOptions = co && type === FilterTypes.Select
      options = o

      const dateFormatFormComponent = (
        <Col key="dateFormat" span={8}>
          <FormItem label="日期格式">
            {getFieldDecorator('dateFormat', {})(
              <Select size="small">
                {
                  datePickerFormatOptions.map((format) => {
                    const title = DatePickerFormatsLocale[format]
                    return (
                      <Option key={title} value={format}>{title}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
        </Col>
      )

      const multipleFormComponent = (
        <Col key="multiple" span={8}>
          <FormItem label="功能">
            {getFieldDecorator('multiple', {
              valuePropName: 'checked'
            })(
              <Checkbox>多选</Checkbox>
            )}
          </FormItem>
        </Col>
      )

      switch (type) {
        case FilterTypes.Date:
          filterTypeRelatedInput.push(dateFormatFormComponent)
          filterTypeRelatedInput.push(multipleFormComponent)
          break
        case FilterTypes.DateRange:
         // filterTypeRelatedInput.push(dateFormatFormComponent)
          break
        case FilterTypes.Select:
          filterTypeRelatedInput.push(multipleFormComponent)
          break
        default:
          break
      }
    }

    const columns = [{
      title: '文本',
      key: 'text',
      dataIndex: 'text'
    }, {
      title: '值',
      key: 'value',
      dataIndex: 'value'
    }]

    return (
      <Form className={styles.filterForm}>
        <div className={styles.title}>
          <h2>控制器配置</h2>
        </div>
        <Row gutter={8} className={styles.formBody}>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('isShow', {
                valuePropName: 'checked',
                initialValue: true
              })(
                <Checkbox>是否显示</Checkbox>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8} className={styles.formBody}>
          <Col span={8}>
            <FormItem label="key">
              {getFieldDecorator('key', {})(<Input disabled={true} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={8} className={styles.formBody}>
          <Col span={8}>
            <FormItem label="类型">
              {getFieldDecorator('type', {})(
                <Select size="small" onChange={selectTypeChange}>
                  {
                    FilterTypeList.map((filterType) => (
                      <Option key={filterType} value={filterType}>{FilterTypesLocale[filterType]}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          {filterTypeRelatedInput}
        </Row>
        <Row gutter={8} className={styles.formBody}>
          {
            interactionType === 'column'
            && operatorOptions
            && !!operatorOptions.length && (
              <Col span={8}>
                <FormItem label="对应关系">
                  {getFieldDecorator('operator', {})(
                    <Select size="small">
                      {
                        operatorOptions.map((o) => (
                          <Option key={o} value={o}>{o}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            )
          }
          <Col span={8}>
            <FormItem label="宽度">
              {getFieldDecorator('width', {})(
                <Select size="small">
                  <Option value={0}>自动适应</Option>
                  <Option value={24}>100%</Option>
                  <Option value={12}>50%</Option>
                  <Option value={8}>33.33% (1/3)</Option>
                  <Option value={6}>25% (1/4)</Option>
                  <Option value={4}>16.67% (1/6)</Option>
                  <Option value={3}>12.5% (1/8)</Option>
                  <Option value={2}>8.33% (1/12)</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {
            type === FilterTypes.Select && (
              <>
                <Col key="cache" span={8}>
                  <FormItem label="缓存">
                    {getFieldDecorator('cache', {})(
                      <RadioGroup size="small">
                        <RadioButton value={true}>开启</RadioButton>
                        <RadioButton value={false}>关闭</RadioButton>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col key="expired" span={8}>
                  <FormItem label="有效期（秒）">
                    {getFieldDecorator('expired', {})(
                      <InputNumber size="small" />
                    )}
                  </FormItem>
                </Col>
              </>
            )
          }
        </Row>
        <Row gutter={8} className={styles.formBody}>
          {this.renderDefaultValueComponent()}
        </Row>
        {
          type === FilterTypes.Select && (
            <Row gutter={8} className={styles.formBody}>
              <Col span={7}>
                <FormItem label="选项">
                  {getFieldDecorator('customOptions', {
                    valuePropName: 'checked'
                  })(
                    <Checkbox>自定义选项</Checkbox>
                  )}
                </FormItem>
              </Col>
              {
                customOptions && (
                  <Col span={2}>
                    <FormItem label=" " colon={false}>
                      <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        shape="circle"
                        onClick={onOpenOptionModal}
                      />
                    </FormItem>
                    <FormItem className={utilStyles.hide}>
                      {getFieldDecorator('options', {})(<Input />)}
                    </FormItem>
                  </Col>
                    )
              }
            </Row>
          )
        }
        {
          type === FilterTypes.Select2 && (
            <Row gutter={8} className={styles.formBody}>
              <Col span={8}>
                <FormItem label="接口地址">
                  {getFieldDecorator('api', {})(
                    <Input size="small" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="请求参数">
                  {getFieldDecorator('requestName', {})(
                    <Input size="small" />
                  )}
                </FormItem>
              </Col>
            </Row>
          )
        }
        {
         (
            <Row gutter={8} className={styles.formBody}>
              <Col span={8}>
                <FormItem label="显隐控制参数">
                  {getFieldDecorator('controlShowKey', {})(
                    <Input size="small" />
                  )}
                </FormItem>
              </Col>
            </Row>
          )
        }
        {
          type === FilterTypes.Select2 && (
            <Row gutter={8} className={styles.formBody}>
              <Col span={8}>
                <FormItem label="联动参数">
                  {getFieldDecorator('subjoin', {})(
                    <Input size="small" />
                  )}
                </FormItem>
              </Col>
            </Row>
          )
        }
        {
          customOptions && (
            <Table
              className={styles.optionList}
              size="small"
              dataSource={options}
              columns={columns}
              pagination={false}
              bordered
            />
          )
        }
      </Form>
    )
  }
}

const formOptions = {
  onValuesChange: (props: IFilterFormProps, changedValues) => {
    const { controlFormValues, onControlTypeChange, onSetControlFormValues } = props
    const { operator, dateFormat } = controlFormValues

    if (Object.keys(changedValues).length === 1) {
      if (changedValues.hasOwnProperty('type')
          || changedValues.hasOwnProperty('multiple')) {
        const type = changedValues.type || controlFormValues.type
        const multiple = changedValues.multiple !== void 0 ? changedValues.multiple : controlFormValues.multiple
        const operatorOptions = getOperatorOptions(type, multiple)
        const datePickerFormatOptions = getDatePickerFormatOptions(type, multiple)

        if (!operatorOptions.includes(operator)) {
          changedValues.operator = operatorOptions[0]
        }

        switch (type) {
          case FilterTypes.Date:
          case FilterTypes.DateRange:
            if (!datePickerFormatOptions.includes(dateFormat)) {
              changedValues.dateFormat = DatePickerFormats.Date
            }
            break
        }
      }

      if (changedValues.hasOwnProperty('multiple')) {
        changedValues.dynamicDefaultValue = void 0
        changedValues.defaultValue = void 0
      }

      if (changedValues.hasOwnProperty('type')) {
        onControlTypeChange(changedValues.type)
      }
    }

    onSetControlFormValues({
      ...controlFormValues,
      ...changedValues
    })
  },
  mapPropsToFields (props: IFilterFormProps) {
    return props.controlFormValues
      ? Object.entries(props.controlFormValues)
          .reduce((result, [key, value]) => {
            result[key] = Form.createFormField({ value })
            return result
          }, {})
      : null
  }
}

export function selectTypeChange () {
  isSelectedTypeChanged = true
  console.log('selecteTypeChange', isSelectedTypeChanged)
}

const mapStateToProps = createStructuredSelector({
  controlFormValues: makeSelectControlForm()
})

export function mapDispatchToProps (dispatch) {
  return {
    onSetControlFormValues: (values) => dispatch(setControlFormValues(values))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<FormComponentProps & IFilterFormProps>(formOptions)(FilterForm))
