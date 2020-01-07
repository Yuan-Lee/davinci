import React from 'react'
import { Row, Col, Radio } from 'antd'

import { onSectionChange } from './util'
import { ISpecConfig } from '../types'

import styles from '../../../Workbench.less'

interface ISpecSectionProgressProps {
  spec: ISpecConfig
  title: string
  onChange: (value: string | number, propPath: string | string[]) => void
}

function SpecSectionProgress (props: ISpecSectionProgressProps) {
  const { spec, title, onChange } = props
  const { chartType } = spec
  
  const selectChange = (prop) => (value) => {
    props.onChange(prop, value)
  }
  return (
    <div className={styles.paneBlock}>
      <h4>{title}</h4>
      <div className={styles.blockBody}>
        <Row gutter={8} type="flex" align="middle" className={styles.blockRow}>
          <Col span={24}>
            <Radio.Group onChange={onSectionChange(onChange, 'chartType')} value={chartType}>
              <Radio value='normal'>默认</Radio>
              <Radio value='circle'>环形</Radio>
              <Radio value='liquidFill'>水波图</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default SpecSectionProgress
