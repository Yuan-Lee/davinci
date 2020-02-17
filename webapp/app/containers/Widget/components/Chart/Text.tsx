
import * as React from 'react'
import { IChartProps } from './'

const dashboardStyles = require('app/containers/Dashboard/Dashboard.less')

export class Text extends React.PureComponent<IChartProps, {}> {
  public render () {
    const { chartStyles } = this.props
    const { spec, text } = chartStyles
    const {
      content,
      fontFamily,
      fontWeight,
      fontSize,
      textAlign,
      textDecorationLine,
      color
    } = text
    const style: React.CSSProperties = {
      color,
      fontFamily,
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight as React.CSSProperties['fontWeight'],
      textAlign: textAlign as React.CSSProperties['textAlign'],
      textDecorationLine: textDecorationLine ? 'line-through' : 'none'
    }
    return (
      <div className={dashboardStyles.title} style={style}>{content}</div>
    )
  }
}

export default Text
