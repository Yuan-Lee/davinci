import React from 'react'
import { Row, Col, Select } from 'antd'
import ColorPicker from 'components/ColorPicker'
import { chartFontFamilyOptions, chartFontSizeOptions } from './constants'
const styles = require('../Workbench.less')

export interface IProgressConfig {
  progressFontFamily: string
  progressFontSize: string
  progressFontColor: string
  barColor: string
  trackColor: string
}

interface IProgressSectionProps {
  title: string
  config: IProgressConfig
  onChange: (prop: string, value: any) => void
}

export class ProgressSection extends React.PureComponent<IProgressSectionProps, {}> {
  constructor (props: IProgressSectionProps) {
    super(props)
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
      progressFontFamily,
      progressFontSize,
      progressFontColor,
      barColor,
      trackColor
    } = config

    return (
      <div>
        <div className={styles.paneBlock}>
          <div className={styles.blockBody}>
            <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
              <Col span={6}>文本字体</Col>
              <Col span={18}>
                <Select
                  className={styles.blockElm}
                  value={progressFontFamily}
                  onChange={this.selectChange('progressFontFamily')}
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
                  value={progressFontSize}
                  onChange={this.selectChange('progressFontSize')}
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
                  value={progressFontColor}
                  onChange={this.colorChange('progressFontColor')}
                />
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles.paneBlock}>
          <div className={styles.blockBody}>
            <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
              <Col span={8}>进度条颜色</Col>
              <Col span={4}>
                <ColorPicker
                  value={barColor}
                  onChange={this.colorChange('barColor')}
                />
              </Col>
            </Row>
          </div>
          <div className={styles.blockBody}>
            <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
              <Col span={8}>轨道颜色</Col>
              <Col span={4}>
                <ColorPicker
                  value={trackColor}
                  onChange={this.colorChange('trackColor')}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

export default ProgressSection
