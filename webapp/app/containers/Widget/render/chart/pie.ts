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

import { IChartProps } from '../../components/Chart'
import { decodeMetricName, getTextWidth } from '../../components/util'
import { getLegendOption, getLabelOption } from './util'
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

  const { title, label, legend, spec, toolbox } = chartStyles

  const { legendPosition, fontSize } = legend

  const { circle, roseType } = spec
  const { selectedItems } = drillOptions
  // formatter: '{b}({d}%)'
  const labelOption = {
    label: getLabelOption('pie', label, metrics)
  }

  const roseTypeValue = roseType ? 'radius' : ''
  const radiusValue =
    (!circle && !roseType) || (!circle && roseType) ? `70%` : ['48%', '70%']

  let seriesObj = {}
  const seriesArr = []
  let legendData = []
  let dataArr = []
  let grouped: { [key: string]: object[] } = {}

  if (metrics.length <= 1) {
    const groupColumns = color.items
      .map((c) => c.name)
      .concat(cols.map((c) => c.name))
      .reduce((distinctColumns, col) => {
        if (!distinctColumns.includes(col)) {
          distinctColumns.push(col)
        }
        return distinctColumns
      }, [])

    grouped = data.reduce<{ [key: string]: object[] }>((obj, val) => {
      const groupingKey = groupColumns
        .reduce((keyArr, col) => keyArr.concat(val[col]), [])
        .join(String.fromCharCode(0))
      if (!obj[groupingKey]) {
        obj[groupingKey] = []
      }
      obj[groupingKey].push(val)
      return obj
    }, {})

    metrics.forEach((metric) => {
      const decodedMetricName = decodeMetricName(metric.name)

      const seriesData = []
      Object.entries(grouped).forEach(([key, value]) => {
        const legendStr = key.replace(String.fromCharCode(0), ' ')
        legendData.push(legendStr)
        value.forEach((v) => {
          const obj = {
            name: legendStr,
            value: v[`${metric.agg}(${decodedMetricName})`]
          }
          seriesData.push(obj)
        })
      })
      let leftValue
      let topValue
      const pieLeft =
        56 +
        Math.max(...legendData.map((s) => getTextWidth(s, '', `${fontSize}px`)))
      switch (legendPosition) {
        case 'top':
          leftValue = width / 2
          topValue = (height + 32) / 2
          break
        case 'bottom':
          leftValue = width / 2
          topValue = (height - 32) / 2
          break
        case 'left':
          leftValue = (width + pieLeft) / 2
          topValue = height / 2
          break
        case 'right':
          leftValue = (width - pieLeft) / 2
          topValue = height / 2
          break
      }

      let colorArr = []
      if (color.items.length) {
        const colorvaluesObj = color.items[0].config.values
        for (const keys in colorvaluesObj) {
          if (colorvaluesObj.hasOwnProperty(keys)) {
            colorArr.push(colorvaluesObj[keys])
          }
        }
      } else {
        colorArr = ['#509af2']
      }

      seriesObj = {
        name: '',
        type: 'pie',
        avoidLabelOverlap: false,
        center: legend.showLegend
          ? [leftValue, topValue]
          : [width / 2, height / 2],
        color: colorArr,
        data: seriesData.map((data, index) => {
          const itemStyleObj =
            selectedItems &&
            selectedItems.length &&
            selectedItems.some((item) => item === index)
              ? {
                  itemStyle: {
                    normal: {
                      opacity: 1
                    }
                  }
                }
              : {}
          dataArr.push({
            ...data,
            ...itemStyleObj
          })
          return {
            ...data,
            ...itemStyleObj
          }
        }),
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          normal: {
            opacity: selectedItems && selectedItems.length > 0 ? 0.25 : 1
          }
        },
        ...labelOption,
        roseType: roseTypeValue,
        radius: radiusValue
      }

      seriesArr.push(seriesObj)
    })
  } else {
    legendData = []
    seriesObj = {
      type: 'pie',
      avoidLabelOverlap: false,
      center: [width / 2, height / 2],
      data: metrics.map((metric) => {
        const decodedMetricName = decodeMetricName(metric.name)
        legendData.push(decodedMetricName)

        const itemStyleObj =
          selectedItems &&
          selectedItems.length &&
          selectedItems.some((item) => item === 0)
            ? {
                itemStyle: {
                  normal: {
                    opacity: 1
                  }
                }
              }
            : {}

        dataArr.push({
          name: decodedMetricName,
          value: data.reduce((sum, record) => sum + record[`${metric.agg}(${decodedMetricName})`], 0),
        })

        return {
          name: decodedMetricName,
          value: data.reduce((sum, record) => sum + record[`${metric.agg}(${decodedMetricName})`], 0),
          ...itemStyleObj
        }
      }),
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        normal: {
          opacity: selectedItems && selectedItems.length > 0 ? 0.25 : 1
        }
      },
      ...labelOption,
      roseType: roseTypeValue,
      radius: radiusValue
    }
    seriesArr.push(seriesObj)
  }

  let otherOptions = null
  let dataObj = {}
  let sum = 0
  if (title) {
    const {
      show,
      text,
      textFontFamily,
      textFontSize,
      textColor,
      subtext,
      subtextFontFamily,
      subtextFontSize,
      subtextColor
    } = title

    if (dataArr && dataArr.length > 0) {
      dataArr.forEach((item) => {
        sum += item.value
        dataObj[item.name] = item.value
      })
    }
    otherOptions = {
      show: title.show,
      text: title.text,
      textStyle: {
        fontFamily: title.textFontFamily,
        fontWeight: 'normal',
        fontSize: title.textFontSize,
        color: title.textColor
      },
      subtext: sum,
      subtextStyle: {
        fontFamily: title.subtextFontFamily,
        fontSize: title.subtextFontSize,
        color: title.subtextColor
      }
    }
  }

  let legendOptions = getLegendOption(legend, legendData)
  legendOptions.formatter = (name) => {
    let str = name
    if (legend.isShowLegendValue && !legend.isShowLegendPercent) {
      str = name + ' ' + dataObj[name]
    } else if (!legend.isShowLegendValue && legend.isShowLegendPercent) {
      str = name + ' （' + (dataObj[name] / sum * 100).toFixed(2) + '%）'
    } else if (legend.isShowLegendValue && legend.isShowLegendPercent) {
      str = name + ' ' + dataObj[name] + ' （' + (dataObj[name] / sum * 100).toFixed(2) + '%）'
    }
    return str
  }

  const pieTitle: EChartTitleOption = {
    ...otherOptions,
    left: 'center',
    top: 'middle'
  }

  const tooltip: EChartOption.Tooltip = {
    trigger: 'item',
    formatter (params: EChartOption.Tooltip.Format) {
      const { color, name, value, percent, dataIndex } = params
      const tooltipLabels = []
      if (color) {
        tooltipLabels.push(
          `<span class="widget-tooltip-circle" style="background: ${color}"></span>`
        )
      }
      tooltipLabels.push(
        `${name}<br/>${getFormattedValue(
          value as number,
          metrics[metrics.length > 1 ? dataIndex : 0].format
        )}（${percent}%）`
      )
      return tooltipLabels.join('')
    }
  }

  return {
    title: pieTitle,
    tooltip,
    legend: legendOptions,
    series: seriesArr
  }
}
