import React from 'react'
import { Button, Radio, Input } from 'antd'

const styles = require('../Dashboard.less')

const RadioGroup = Radio.Group

interface IDownDrillSettingProps {
  widgets: any[]
  itemId: number | boolean
  currentItems: any[]
  selectedWidget: number[]
  saveDownDrillSetting: (flag: any) => any
}

interface IDownDrillSettingStates {
  settingObj: any
}

export class DownDrillSetting extends React.PureComponent<IDownDrillSettingProps, IDownDrillSettingStates> {

  constructor (props) {
    super(props)
    this.state = {
      settingObj: {
        customDrill: 0,
        url: ''
      }
    }
  }

  public componentWillMount () {
    const { itemId, currentItems } = this.props
    this.init(itemId, currentItems)
  }

  public componentWillReceiveProps (nextProps) {
    const { itemId, currentItems } = nextProps
    if (this.props.itemId !== itemId) {
      this.init(itemId, currentItems)
    }
  }

  private init = (itemId, currentItems) => {
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
  }

  private getCurrentWidget = (widgetId) => {
    const { widgets } = this.props
    const currentWidget = widgets.find((widget) => widget.id === widgetId)
    return currentWidget
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

  private urlChange = (e) => {
    const tempSettingObj = Object.assign({}, this.state.settingObj, { url: e.target.value })
    this.setState({
      settingObj: tempSettingObj
    })
  }

  public render () {

    const { settingObj } = this.state

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

    return (
      <div className={styles.downDrillSetting}>
        <div>
          <div className={styles.label}>是否启用： </div>
          <RadioGroup value={settingObj.customDrill} onChange={this.customDrillChange}>
            <Radio value={1}>是</Radio>
            <Radio value={0} checked>否</Radio>
          </RadioGroup>
        </div>
        <div>
          <div className={styles.label}>URL： </div>
          <Input placeholder="请输入URL" value={settingObj.url} onChange={this.urlChange} />
        </div>
        <div className={styles.footer}>
          {downDrillSettingButtons}
        </div>
      </div>
    )
  }
}

export default DownDrillSetting
