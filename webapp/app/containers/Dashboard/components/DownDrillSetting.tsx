import React from 'react'
import { Button, Radio, Input, Tag } from 'antd'

const styles = require('../Dashboard.less')

const RadioGroup = Radio.Group

interface IDownDrillSettingProps {
  widgets: any[]
  currentItemsInfo: any
  itemId: number | boolean
  currentItems: any[]
  selectedWidget: number[]
  saveDownDrillSetting: (flag: any) => any
}

interface IDownDrillSettingStates {
  settingObj: any,
  chartDataKeys: string[]
}

export class DownDrillSetting extends React.PureComponent<IDownDrillSettingProps, IDownDrillSettingStates> {

  constructor (props) {
    super(props)
    this.state = {
      settingObj: {
        customDrill: 0,
        // way: 1,
        url: '',
        chartDataParams: '',
        queryDataParams: ''
      },
      chartDataKeys: []
    }
  }

  public componentWillMount () {
    const { itemId, currentItems, currentItemsInfo } = this.props
    this.init(itemId, currentItems, currentItemsInfo)
  }

  public componentWillReceiveProps (nextProps) {
    const { itemId, currentItems, currentItemsInfo } = nextProps
    if (this.props.itemId !== itemId) {
      this.init(itemId, currentItems, currentItemsInfo)
    }
  }

  private init = (itemId, currentItems, currentItemsInfo) => {
    const currentItem = currentItems.find(item => {
      return item.id === itemId
    })
    let currentItemConfig
    if (currentItem) {
      const { config } = currentItem
      if (config && config.length) {
        try {
          currentItemConfig = JSON.parse(config)
        } catch (err) {
          throw new Error(err)
        }
      }
    }
    if (currentItemConfig) {
      const downDrillSettingObj = currentItemConfig.downDrillSettingObj
      if (downDrillSettingObj) {
        this.setState({
          settingObj: downDrillSettingObj
        })
      }
    }
    const dashboardItem = currentItemsInfo[itemId]
    if (dashboardItem && dashboardItem.datasource && dashboardItem.datasource.columns) {
      const chartDataKeys = []
      dashboardItem.datasource.columns.forEach(colum => {
        const { name } = colum
        if (chartDataKeys.indexOf(name) === -1) {
          chartDataKeys.push(name)
        }
      })
      this.setState({
        chartDataKeys
      })
    }
  }

  private onSaveDownDrillSetting = () => {
    const { saveDownDrillSetting } = this.props
    const { settingObj } = this.state
    saveDownDrillSetting(settingObj)
  }

  private customDrillChange = (e) => {
    const tempSettingObj = Object.assign({}, this.state.settingObj, { customDrill: e.target.value })
    this.setState({
      settingObj: tempSettingObj
    })
  }

  // private wayChange = (e) => {
  //   const tempSettingObj = Object.assign({}, this.state.settingObj, { way: e.target.value })
  //   this.setState({
  //     settingObj: tempSettingObj
  //   })
  // }

  private urlChange = (e) => {
    const tempSettingObj = Object.assign({}, this.state.settingObj, { url: e.target.value })
    this.setState({
      settingObj: tempSettingObj
    })
  }

  private chartDataParamsChange = (e) => {
    const tempSettingObj = Object.assign({}, this.state.settingObj, { chartDataParams: e.target.value })
    this.setState({
      settingObj: tempSettingObj
    })
  }

  private queryDataParamsChange = (e) => {
    const tempSettingObj = Object.assign({}, this.state.settingObj, { queryDataParams: e.target.value })
    this.setState({
      settingObj: tempSettingObj
    })
  }

  tagForMap = tag => {
    const tagEle = (
      <Tag color="#2db7f5">
        {tag}
      </Tag>
    )
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagEle}
      </span>
    )
  }

  public render () {

    const { settingObj, chartDataKeys } = this.state

    const downDrillSettingButtons = [
      (
        <Button
          key="submit"
          size="large"
          type="primary"
          onClick={this.onSaveDownDrillSetting}
        >
          保 存
        </Button>
      )
    ]

    const tagChild = chartDataKeys.map(this.tagForMap)

    return (
      <div className={styles.downDrillSetting}>
        <div>
          <div className={styles.label}>是否启用： </div>
          <RadioGroup value={settingObj.customDrill} onChange={this.customDrillChange}>
            <Radio value={1}>是</Radio>
            <Radio value={0} checked>否</Radio>
          </RadioGroup>
        </div>
        {/* <div>
          <div className={styles.label}>方式： </div>
          <RadioGroup value={settingObj.way} onChange={this.wayChange}>
            <Radio value={1} checked>新窗口</Radio>
            <Radio value={2}>重定向</Radio>
          </RadioGroup>
        </div> */}
        <div>
          <div className={styles.label}>URL： </div>
          <Input placeholder="请输入URL" value={settingObj.url} onChange={this.urlChange} />
        </div>
        <div>
          <div className={styles.label}>图表参数（多个参数使用&amp;符号连接）： </div>
          <div style={{ marginBottom: '15px' }}>
            {tagChild}
          </div>
          <Input placeholder="请输入图表参数" value={settingObj.chartDataParams} onChange={this.chartDataParamsChange} />
        </div>
        <div>
          <div className={styles.label}>查询参数（多个参数使用&amp;符号连接）： </div>
          <Input placeholder="请输入查询参数" value={settingObj.queryDataParams} onChange={this.queryDataParamsChange} />
        </div>
        <div className={styles.footer}>
          {downDrillSettingButtons}
        </div>
      </div>
    )
  }
}

export default DownDrillSetting
