import React from 'react'
import { Row, Col, Checkbox, Select, Input } from 'antd'
import debounce from 'lodash/debounce'
import ColorPicker from 'components/ColorPicker'
import { chartFontFamilyOptions, chartFontSizeOptions } from './constants'
const styles = require('../Workbench.less')

export interface ITitleConfig {
  show: boolean
  text: string
  textFontSize: number
  textFontFamily: string
  textColor: string
  subtext: string
  subtextFontSize: number
  subtextFontFamily: string
  subtextColor: string
}

interface ITitleSectionProps {
  title: string
  config: ITitleConfig
  onChange: (prop: string, value: any) => void
}

export class TitleSection extends React.PureComponent<ITitleSectionProps, {}> {

  private debounceInputChange = null

  constructor (props: ITitleSectionProps) {
    super(props)
    this.debounceInputChange = debounce(props.onChange, 1500)
  }

  private showChange = (prop) => (e) => {
    this.props.onChange(prop, e.target.checked)
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

  public render () {
    const { title, config } = this.props

    const {
      show,
      text,
      textFontSize,
      textFontFamily,
      textColor,
      subtext,
      subtextFontSize,
      subtextFontFamily,
      subtextColor
    } = config

    return (
      <div className={styles.paneBlock}>
        <h4>{title}</h4>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={12}>
              <Checkbox
                checked={show}
                onChange={this.showChange('show')}
              >显示翻牌器</Checkbox>
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>标题</Col>
            <Col span={18}>
              <Input onChange={this.inputChange('text')} defaultValue={text} />
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>标题字体</Col>
            <Col span={18}>
            <Select
                placeholder="字体"
                className={styles.blockElm}
                value={textFontFamily}
                onChange={this.selectChange('textFontFamily')}
              >
                {chartFontFamilyOptions}
              </Select>
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>标题颜色</Col>
            <Col span={4}>
              <ColorPicker
                value={textColor}
                onChange={this.colorChange('textColor')}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>标题大小</Col>
            <Col span={18}>
              <Select
                placeholder="字体"
                className={styles.blockElm}
                value={textFontSize}
                onChange={this.selectChange('textFontSize')}
              >
                {chartFontSizeOptions}
              </Select>
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>数值字体</Col>
            <Col span={18}>
            <Select
                placeholder="字体"
                className={styles.blockElm}
                value={subtextFontFamily}
                onChange={this.selectChange('subtextFontFamily')}
              >
                {chartFontFamilyOptions}
              </Select>
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>数值颜色</Col>
            <Col span={4}>
              <ColorPicker
                value={subtextColor}
                onChange={this.colorChange('subtextColor')}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>数值大小</Col>
            <Col span={18}>
              <Select
                placeholder="字体"
                className={styles.blockElm}
                value={subtextFontSize}
                onChange={this.selectChange('subtextFontSize')}
              >
                {chartFontSizeOptions}
              </Select>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default TitleSection
