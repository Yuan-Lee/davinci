import ChartTypes from './ChartTypes'
import {
  PIVOT_CHART_FONT_FAMILIES,
  PIVOT_DEFAULT_FONT_COLOR
} from 'app/globalConstants'

import { IChartInfo } from 'containers/Widget/components/Widget'
const progress: IChartInfo = {
  id: ChartTypes.Progress,
  name: 'progress',
  title: '进度条',
  extensionIcon: true,
  icon: 'icon-chartjindutiao',
  coordinate: 'cartesian',
  rules: [{ dimension: 0, metric: 1 }],
  dimetionAxis: 'col',
  data: {
    cols: {
      title: '列',
      type: 'category'
    },
    rows: {
      title: '行',
      type: 'category'
    },
    metrics: {
      title: '指标',
      type: 'value'
    },
    filters: {
      title: '筛选',
      type: 'all'
    },
    color: {
      title: '颜色',
      type: 'category'
    }
    // tip: {
    //   title: '提示信息',
    //   type: 'value'
    // }
  },
  style: {
    progress: {
      progressFontFamily: PIVOT_CHART_FONT_FAMILIES[0].value,
      progressFontSize: 24,
      progressFontColor: PIVOT_DEFAULT_FONT_COLOR,
      barColor: '#1B98E0',
      trackColor: '#ddd'
    },
    liquidFill: {
      liquidFillFontFamily: PIVOT_CHART_FONT_FAMILIES[0].value,
      liquidFillFontSize: 24,
      liquidFillFontColor: PIVOT_DEFAULT_FONT_COLOR,
      borderShow: true,
      borderColor: '#294D99',
      bgColor: '#E3F7FF',
      waveColor: '#294D99'
    },
    spec: {
      chartType: 'normal'
    }
  }
}

export default progress
