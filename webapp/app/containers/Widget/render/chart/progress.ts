import { IChartProps } from '../../components/Chart'
import { decodeMetricName, getTextWidth } from '../../components/util'
import { EChartOption, EChartTitleOption } from 'echarts'
import { getFormattedValue } from '../../components/Config/Format'

export default function (chartProps: IChartProps, drillOptions?: any) {
  const {
    width,
    height,
    data,
    cols,
    metrics,
    chartStyles,
    color,
    tip
  } = chartProps

  const { progress, spec, liquidFill } = chartStyles

  const {
    progressFontFamily,
    progressFontSize,
    progressFontColor,
    barColor,
    trackColor
  } = progress

  const { chartType } = spec

  const {
    liquidFillFontFamily,
    liquidFillFontSize,
    liquidFillFontColor,
    borderShow,
    borderColor,
    bgColor,
    waveColor
  } = liquidFill

  let progressData = 0
  let seriesData = []
  if (data.length > 0) {
    Object.entries(data[0]).forEach(([key, value]) => {
      seriesData.push({
        name: key.split('(')[1].split(')')[0],
        value: value
      })
    })
    progressData = seriesData[0].value.toFixed(2)
    seriesData.push({
      name: '',
      value: 100 - seriesData[0].value
    })
  }

  let seriesObj = {}

  if (chartType === 'circle') {
    seriesObj = {
      name: '',
      type: 'pie',
      radius: ['50%', '70%'],
      color: [barColor, trackColor],
      hoverAnimation: false,
      label: {
        show: false
      },
      data: seriesData
    }

    const title: EChartTitleOption = {
      left: 'center',
      top: 'middle',
      show: true,
      text: progressData + '%',
      textStyle: {
        fontFamily: progressFontFamily,
        fontWeight: 'normal',
        fontSize: progressFontSize,
        color: progressFontColor
      }
    }

    return {
      title,
      series: seriesObj
    }
  } else {
    seriesObj = {
      type: 'liquidFill',
      color: [waveColor],
      radius: '70%',
      outline: {
        show: borderShow,
        borderDistance: 3,
        itemStyle: {
          borderColor: borderColor,
        }
      },
      label: {
        color: liquidFillFontColor,
        fontFamily: liquidFillFontFamily,
        fontSize: liquidFillFontSize
      },
      backgroundStyle: {
        color: bgColor
      },
      data: seriesData.length > 0 ? [seriesData[0].value / 100] : []
    }

    return {
      series: seriesObj
    }
  }
}
