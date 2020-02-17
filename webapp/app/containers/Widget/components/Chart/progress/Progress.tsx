import * as React from 'react'
import { IChartProps } from '../'

const styles = require('./Progress.less')

export class Progress extends React.PureComponent<IChartProps, {}> {
  public render () {
    const { data, chartStyles } = this.props
    const { spec, progress } = chartStyles
    const {
      progressFontFamily,
      progressFontSize,
      progressFontColor,
      barColor,
      trackColor
    } = progress

    let value = data.length > 0 ? Object.entries(data[0])[0][1].toFixed(2) : 0.00
    const valueStyle: React.CSSProperties = {
      color: progressFontColor,
      fontFamily: progressFontFamily,
      fontSize: `${progressFontSize}px`
    }

    const trackStyle: React.CSSProperties = {
      background: trackColor
    }

    const barStyle: React.CSSProperties = {
      width: `${value}%`,
      background: barColor
    }

    return (
      <div className={styles.progressWrapper}>
        <div className={styles.progressValue} style={valueStyle}>{value}%</div>
        <div className={styles.progressBar} style={trackStyle}>
          <div style={barStyle}></div>
        </div>
      </div>
    )
  }
}

export default Progress
