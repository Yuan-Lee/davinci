import React from 'react'
import { IChartProps } from '../'
import Progress from './Progress'
import Chart from '../Chart'

export class ProgressChart extends React.PureComponent<IChartProps, {}> {

  public render () {
    const { chartStyles } = this.props
    const { spec } = chartStyles

    switch (spec.chartType) {
      case 'normal':
        return (
          <Progress {...this.props}/>
        )
      default:
        return (
          <Chart {...this.props}/>
        )
    }
  }
}

export default ProgressChart
