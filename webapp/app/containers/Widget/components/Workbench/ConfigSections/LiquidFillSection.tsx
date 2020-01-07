import React from 'react'
import { Row, Col, Checkbox, Select, Input } from 'antd'
import ColorPicker from 'components/ColorPicker'
import { chartFontFamilyOptions, chartFontSizeOptions } from './constants'
const styles = require('../Workbench.less')

export interface ILiquidFillConfig {
  liquidFillFontFamily: string
  liquidFillFontSize: number
  liquidFillFontColor: string
  borderShow: true
  borderColor: string
  bgColor: string
  waveColor: string
}

interface ILiquidFillSectionProps {
  title: string
  config: ILiquidFillConfig
  onChange: (prop: string, value: any) => void
}

export class LiquidFillSection extends React.PureComponent<ILiquidFillSectionProps, {}> {

  constructor (props: ILiquidFillSectionProps) {
    super(props)
  }

  private showChange = (prop) => (e) => {
    this.props.onChange(prop, e.target.checked)
  }

  private selectChange = (prop) => (value) => {
    this.props.onChange(prop, value)
  }

  private colorChange = (prop) => (color) => {
    this.props.onChange(prop, color)
  }

  public render () {
    const { config } = this.props

    const {
      liquidFillFontFamily,
      liquidFillFontSize,
      liquidFillFontColor,
      borderShow,
      borderColor,
      bgColor,
      waveColor
    } = config

    return (
      <div className={styles.paneBlock}>
        <div className={styles.blockBody}>
            <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
              <Col span={6}>文本字体</Col>
              <Col span={18}>
              <Select
                  className={styles.blockElm}
                  value={liquidFillFontFamily}
                  onChange={this.selectChange('liquidFillFontFamily')}
                >
                  {chartFontFamilyOptions}
                </Select>
              </Col>
            </Row>
          </div>
          <div className={styles.blockBody}>
            <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
              <Col span={6}>文本大小</Col>
              <Col span={18}>
                <Select
                  className={styles.blockElm}
                  value={liquidFillFontSize}
                  onChange={this.selectChange('liquidFillFontSize')}
                >
                  {chartFontSizeOptions}
                </Select>
              </Col>
            </Row>
          </div>
          <div className={styles.blockBody}>
            <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
              <Col span={6}>文本颜色</Col>
              <Col span={4}>
                <ColorPicker
                  value={liquidFillFontColor}
                  onChange={this.colorChange('liquidFillFontColor')}
                />
              </Col>
            </Row>
          </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={12}>
              <Checkbox
                checked={borderShow}
                onChange={this.showChange('borderShow')}
              >是否显示边框</Checkbox>
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>边框颜色</Col>
            <Col span={4}>
            <ColorPicker
                value={borderColor}
                onChange={this.colorChange('borderColor')}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>背景色</Col>
            <Col span={4}>
              <ColorPicker
                value={bgColor}
                onChange={this.colorChange('bgColor')}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.blockBody}>
          <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
            <Col span={6}>波纹颜色</Col>
            <Col span={4}>
              <ColorPicker
                value={waveColor}
                onChange={this.colorChange('waveColor')}
              />
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default LiquidFillSection
