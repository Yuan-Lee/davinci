import ChartTypes from './ChartTypes'

import { IChartInfo } from 'containers/Widget/components/Widget'

const text: IChartInfo = {
  id: ChartTypes.Text,
  name: 'text',
  title: '文本',
  extensionIcon: true,
  icon: 'icon-chartwenben',
  coordinate: 'other',
  rules: [{ dimension: 0, metric: 0 }],
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
    }
  },
  style: {
    text: {
      content: '',
      fontFamily: 'Microsoft YaHei',
      fontSize: 16,
      color: '#333',
      fontWeight: 'normal',
      textAlign: 'left',
      textDecorationLine: false
    },
    spec: {}
  }
}

export default text