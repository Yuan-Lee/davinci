import * as React from 'react'
import { Row, Col, Select, Input, Radio, Checkbox } from 'antd'
import debounce from 'lodash/debounce'
const Option = Select.Option
import ColorPicker from 'components/ColorPicker'
import { PIVOT_CHART_FONT_FAMILIES, PIVOT_CHART_FONT_SIZES } from 'app/globalConstants'
const styles = require('../Workbench.less')

export interface TextConfig {
  content: string
  fontFamily: string
  fontWeight: string
  fontSize: string
  textAlign: string
  textDecorationLine: boolean,
  color: string
}

interface ITextProps {
  title: string
  config: TextConfig
  onChange: (prop: string, value: any) => void
}

export class ITextSection extends React.PureComponent<ITextProps, {}> {
  private debounceInputChange = null

  constructor (props: ITextProps) {
    super(props)
    this.debounceInputChange = debounce(props.onChange, 1500)
  }

  private inputChange = (prop) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.debounceInputChange(prop, e.target.value)
  } 
  private selectChange = (prop) => (value) => {
    this.props.onChange(prop, value)
  }

  private colorChange = (prop) => (color) => {
    this.props.onChange(prop, color)
  }

  private textAlignChange = (prop) => (e) => {
    this.props.onChange(prop, e.target.value)
  }

  private textDecorationLineChange = (prop) => (e) => {
    this.props.onChange(prop, e.target.checked)
  }

  public render () {
    const { title, config } = this.props

    const {
      content,
      fontFamily,
      fontWeight,
      fontSize,
      textAlign,
      textDecorationLine,
      color
    } = config

    const fontFamilies = PIVOT_CHART_FONT_FAMILIES.map((f) => (
      <Option key={f.value} value={f.value}>{f.name}</Option>
    ))
    const fontSizes = PIVOT_CHART_FONT_SIZES.map((f) => (
      <Option key={f} value={`${f}`}>{f}</Option>
    ))

    return (
      <div className={styles.paneBlock}>
        <h4>{title}</h4>
        <div>
          <Input onChange={this.inputChange('content')} defaultValue={content} />
        </div>
        <br/>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={4}>字体</Col>
            <Col span={20}>
              <Select
                placeholder="字体"
                className={styles.blockElm}
                value={fontFamily}
                onChange={this.selectChange('fontFamily')}
              >
                {fontFamilies}
              </Select>
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={4}>大小</Col>
            <Col span={20}>
              <Select
                placeholder="文字大小"
                className={styles.blockElm}
                value={fontSize}
                onChange={this.selectChange('fontSize')}
              >
                {fontSizes}
              </Select>
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={4}>颜色</Col>
            <Col span={8}>
              <ColorPicker
                value={color}
                onChange={this.colorChange('color')}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>对齐方式</Col>
            <Col span={18}>
              <Radio.Group onChange={this.textAlignChange('textAlign')} value={textAlign}>
                <Radio value='left'>左</Radio>
                <Radio value='center'>中</Radio>
                <Radio value='right'>右</Radio>
              </Radio.Group>
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>删除线</Col>
            <Col span={18}>
              <Checkbox
                checked={textDecorationLine}
                onChange={this.textDecorationLineChange('textDecorationLine')}
              />
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default ITextSection
