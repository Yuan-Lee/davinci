import React, { Component } from 'react'
import classnames from 'classnames'
import { FormComponentProps } from '@ant-design/compatible/lib/form/Form';
import {
  IGlobalControl,
  IControlRelatedField,
  IControlRequestParams,
  IMapItemControlRequestParams,
  OnGetControlOptions,
  IMapControlOptions,
  IRenderTreeItem,
  IGlobalRenderTreeItem,
  GlobalControlQueryMode
} from './types'
import {
  getVariableValue,
  getModelValue,
  deserializeDefaultValue,
  getControlRenderTree,
  getAllChildren,
  getParents
} from './util'
import { defaultFilterControlGridProps, SHOULD_LOAD_OPTIONS, fullScreenGlobalControlGridProps } from './filterTypes'
import FilterControl from './FilterControl'
import { globalControlMigrationRecorder } from 'app/utils/migrationRecorders'

import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';

import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import { Row, Col, Button } from 'antd';

const styles = require('./filter.less')

interface IFilterPanelProps {
  currentDashboard: any
  currentItems: any[]
  mapOptions: IMapControlOptions
  onGetOptions: OnGetControlOptions
  onChange: (controlRequestParamsByItem: IMapItemControlRequestParams) => void
  onSearch: (itemIds: number[], controlRequestParamsByItem?: IMapItemControlRequestParams) => void
  isFullScreen?: boolean
}

interface IFilterPanelStates {
  isRender: Boolean,
  renderTree: IRenderTreeItem[],
  flatTree: {
    [key: string]: IRenderTreeItem
  },
  controlValues: {
    [key: string]: any
  },
  queryMode: GlobalControlQueryMode
}

export class FilterPanel extends Component<IFilterPanelProps & FormComponentProps, IFilterPanelStates> {

  public constructor (props: IFilterPanelProps & FormComponentProps) {
    super(props)
    this.state = {
      isRender: false, // 用于判断是否渲染搜索栏
      renderTree: [],
      flatTree: {},
      controlValues: {},
      queryMode: GlobalControlQueryMode.Immediately
    }
  }

  private deep_set (o, path, value) {
    let i = 0
    for (; i < path.length - 1; i++) {
        if (o[path[i]] === undefined) {
          o[decodeURIComponent(path[i])] = path[i + 1].match(/^\d+$/) ? [] : {}
        }
        o = o[decodeURIComponent(path[i])]
    }
    o[decodeURIComponent(path[i])] = decodeURIComponent(value)
  }

  private querystring = (str) => {
    return str.split('&').reduce((o, kv) => {
      const [key, value] = kv.split('=')
      if (!value) {
          return o
      }
      this.deep_set(o, key.split(/[\[\]]/g).filter((x) => x), value)
      return o
    }, {});
  }

  private qs = this.querystring(location.href.substr(location.href.indexOf('?') + 1))

  private controlRequestParamsByItem: {
    [itemId: number]: {
      [filterKey: string]: IControlRequestParams
    }
  } = {}

  public componentDidMount () {
    const { currentDashboard, currentItems } = this.props
    if (currentDashboard && currentDashboard.id) {
      this.initDerivedState(currentDashboard, currentItems, true)
    }
  }

  public componentWillReceiveProps (nextProps: IFilterPanelProps & FormComponentProps) {
    const { currentDashboard, currentItems } = nextProps
    if (currentDashboard !== this.props.currentDashboard
        || this.dashboardItemsChange(currentItems, this.props.currentItems)) {
      const isCurrentDashboardUpdated = this.props.currentDashboard && this.props.currentDashboard.id === (currentDashboard && currentDashboard.id)
      this.initDerivedState(currentDashboard, currentItems, isCurrentDashboardUpdated)
    }
  }

  private dashboardItemsChange = (currentItems, previousItems) => {
    if (currentItems && previousItems) {
      const currentItemIds = currentItems.map((item) => item.id).sort().join(',')
      const previousItemIds = previousItems.map((item) => item.id).sort().join(',')
      return !(currentItems.length === previousItems.length && currentItemIds === previousItemIds)
    }
    return false
  }

  private initDerivedState = (currentDashboard, currentItems, isCurrentDashboardUpdated) => {
    if (currentDashboard) {
      this.props.form.resetFields()
      const config = JSON.parse(currentDashboard.config || '{}')
      const globalControls = config.filters || []
      const queryMode = config.queryMode || GlobalControlQueryMode.Immediately

      const controlValues = {}

      this.controlRequestParamsByItem = {}

      const controls: IGlobalControl[] = globalControls.map((control) => {
        control = globalControlMigrationRecorder(control)
        const { relatedItems } = control
        Object.keys(relatedItems).forEach((itemId) => {
          if (!currentItems.find((ci) => ci.id === Number(itemId))) {
            delete relatedItems[itemId]
          }
        })

        const defaultFilterValue = deserializeDefaultValue(control)
        if (defaultFilterValue) {
          controlValues[control.key] = defaultFilterValue
          this.setControlRequestParams(control, defaultFilterValue, currentItems)
        }

        return control
      })
      this.setState({isRender: false})
      const { renderTree, flatTree } = getControlRenderTree<IGlobalControl, IRenderTreeItem>(controls)
      Object.values(flatTree).forEach((control) => {
        let controlShow = true
        if (control.controlShowKey) {
          const qs = this.qs
          if (qs && qs[control.controlShowKey] == 0) {
            controlShow = false
          }
        }
        if (control.isShow && controlShow) {
          this.setState({
            isRender: true
          })
        }
        if (SHOULD_LOAD_OPTIONS[control.type]) {
          this.loadOptions(control, flatTree, controlValues)
        }
      })

      this.setState({
        renderTree,
        flatTree,
        controlValues,
        queryMode
      }, () => {
        if (isCurrentDashboardUpdated) {
          this.batchChange()
        }
      })
    }
  }

  // save defaultFilterValue
  private setControlRequestParams = (control: IGlobalControl, val, currentItems, callback?) => {
    const { key, interactionType, relatedItems, relatedViews } = control

    currentItems.forEach((item) => {
      const { id } = item
      const relatedItem = relatedItems[id]
      if (relatedItem && relatedItem.checked) {
        const fields = relatedViews[relatedItem.viewId]
        if (callback) {
          callback(id)
        }
        if (!this.controlRequestParamsByItem[id]) {
          this.controlRequestParamsByItem[id] = {}
        }
        if (!this.controlRequestParamsByItem[id][key]) {
          this.controlRequestParamsByItem[id][key] = {
            variables: [],
            filters: []
          }
        }
        if (interactionType === 'column') {
          this.controlRequestParamsByItem[id][key].filters = getModelValue(control, fields as IControlRelatedField, val)
        } else {
          this.controlRequestParamsByItem[id][key].variables = getVariableValue(control, fields, val)
        }
      }
    })
  }

  private loadOptions = (
    renderControl: IRenderTreeItem,
    flatTree: { [key: string]: IRenderTreeItem },
    controlValues: { [key: string]: any }
  ) => {
    const { onGetOptions } = this.props
    const {
      key,
      interactionType,
      relatedViews,
      parent,
      cache,
      expired,
      customOptions,
      options
    } = renderControl as IGlobalRenderTreeItem

    if (customOptions) {
      onGetOptions(key, true, options)
    } else {
      const parents = getParents<IGlobalControl>(parent, flatTree)

      const requestParams = Object.entries(relatedViews).reduce((obj, [viewId, fields]) => {
        let filters = []
        let variables = []

        parents.forEach((parentControl) => {
          const parentValue = controlValues[parentControl.key]
          Object.entries(parentControl.relatedViews).forEach(([parentViewId, parentFields]) => {
            if (relatedViews[parentViewId]) {
              if (parentControl.interactionType === 'column') {
                filters = filters.concat(getModelValue(parentControl, parentFields as IControlRelatedField, parentValue))
              } else {
                variables = variables.concat(getVariableValue(parentControl, parentFields, parentValue))
              }
            }
          })
        })

        if (interactionType === 'column') {
          obj[viewId] = {
            columns: [(fields as IControlRelatedField).name],
            filters,
            variables,
            cache,
            expired
          }
        } else {
          if ((fields as IControlRelatedField).optionsFromColumn) {
            obj[viewId] = {
              columns: [(fields as IControlRelatedField).column],
              filters,
              variables,
              cache,
              expired
            }
          }
        }

        return obj
      }, {})

      if (Object.keys(requestParams).length) {
        onGetOptions(key, false, requestParams)
      }
    }
  }

  private change = (control: IGlobalControl, val, isInputChange?: boolean) => {

    const { currentItems, onChange } = this.props
    const { flatTree, queryMode } = this.state
    const { key } = control
    const childrenKeys = getAllChildren(key, flatTree)
    const relatedItemIds = []

    const controlValues = {
      ...this.state.controlValues,
      [key]: val
    }

    if (childrenKeys.length) {
      childrenKeys.forEach((childKey) => {
        const child = flatTree[childKey]
        if (SHOULD_LOAD_OPTIONS[child.type]) {
          this.loadOptions(child, flatTree, controlValues)
        }
      })
    }

    this.setControlRequestParams(control, val, currentItems, (itemId) => {
      relatedItemIds.push(itemId)
    })

    this.setState({ controlValues })

    const controlRequestParamsByItem: IMapItemControlRequestParams = relatedItemIds.reduce((acc, itemId) => {
      acc[itemId] = Object.values(this.controlRequestParamsByItem[itemId]).reduce((filterValue, val) => {
        filterValue.variables = filterValue.variables.concat(val.variables)
        filterValue.filters = filterValue.filters.concat(val.filters)
        return filterValue
      }, {
        variables: [],
        filters: []
      })
      return acc
    }, {})

    if (queryMode === GlobalControlQueryMode.Immediately && !isInputChange) {
      this.search(controlRequestParamsByItem)
    } else {
      onChange(controlRequestParamsByItem)
    }
  }

  private search = (controlRequestParamsByItem?: IMapItemControlRequestParams) => {
    const itemIds: number[] = Object.values(this.state.flatTree)
      .reduce((arr: number[], item) => {
        const { relatedItems } = item as IGlobalRenderTreeItem
        return arr.concat(
          Object.entries(relatedItems)
            .filter(([itemId, info]) => info.checked)
            .map(([itemId, info]) => Number(itemId))
        )
      }, [])
    this.props.onSearch(Array.from(new Set(itemIds)), controlRequestParamsByItem)
  }

  private manualSearch = () => {
    this.search()
  }

  private batchChange = (isReset?: boolean) => {
    const controlRequestParamsByItem = Object
      .entries(this.controlRequestParamsByItem)
      .reduce((paramsByItem, [itemId, expsByControl]) => {
        paramsByItem[itemId] = Object
          .values(expsByControl)
          .reduce((params, exps) => {
            params.variables = params.variables.concat(exps.variables)
            params.filters = params.filters.concat(exps.filters)
            return params
          }, {
            variables: [],
            filters: []
          })
        return paramsByItem
      }, {})

    if (!isReset && this.state.queryMode === GlobalControlQueryMode.Immediately) {
      this.search(controlRequestParamsByItem)
    } else {
      this.props.onChange(controlRequestParamsByItem)
    }
  }

  private reset = () => {
    this.props.form.resetFields()

    const { currentItems } = this.props
    const { flatTree } = this.state
    const formValues = this.props.form.getFieldsValue()

    Object.entries(formValues).forEach(([controlKey, value]) => {
      const control = flatTree[controlKey]
      if (window[`select2_${control.key}`]) {
        window[`select2_${control.key}`]()
      }
      this.setControlRequestParams(control as IGlobalRenderTreeItem, value, currentItems)
    })

    this.batchChange(true)
  }

  private renderFilterControls = (renderTree: IRenderTreeItem[], parents?: IGlobalControl[]) => {
    const { form, mapOptions, isFullScreen } = this.props
    const { controlValues } = this.state

    let components = []

    renderTree.forEach((control) => {
      const { key, width, children, ...rest } = control as IGlobalRenderTreeItem
      const parentsInfo = parents
        ? parents.reduce((values, parentControl) => {
            const parentSelectedValue = controlValues[parentControl.key]
            if (parentSelectedValue && !(Array.isArray(parentSelectedValue) && !parentSelectedValue.length)) {
              values = values.concat({
                control: parentControl,
                value: parentSelectedValue
              })
            }
            return values
          }, [])
        : null
      let controlGridProps = width
          ? {
              lg: width,
              md: width < 8 ? 12 : 24
            }
          : defaultFilterControlGridProps
      if (isFullScreen) {
        controlGridProps = fullScreenGlobalControlGridProps
      }

      let controlShow = true
      if (control.controlShowKey) {
        const qs = this.qs
        if (qs && qs[control.controlShowKey] == 0) {
          controlShow = false
        }
      }
      if (control.isShow && controlShow) {
        components = components.concat(
          <Col
            key={key}
            {...controlGridProps}
          >
            <FilterControl
              form={form}
              control={control}
              currentOptions={mapOptions[key] || []}
              parentsInfo={parentsInfo}
              onChange={this.change}
            />
          </Col>
        )
      }

      if (children) {
        const controlWithOutChildren = { key, width, ...rest }
        components = components.concat(
          this.renderFilterControls(children, parents ? parents.concat(controlWithOutChildren) : [controlWithOutChildren])
        )
      }
    })
    return components
  }

  public render () {
    const { isRender, renderTree, queryMode } = this.state
    const { isFullScreen } = this.props
    const panelClass = classnames({
      [styles.controlPanel]: true,
      [styles.empty]: !renderTree.length,
      [styles.flexColumn]: isFullScreen
    })

    const controlClass = classnames({
      [styles.wfull]: isFullScreen,
      [styles.controls]: true
    })

    const actionClass = classnames({
      [styles.actions]: true,
      [styles.flexEnd]: isFullScreen,
      [styles.mt16]: isFullScreen
    })

    return isRender && <Form className={panelClass}>
      <div className={controlClass}>
        <Row gutter={8}>
          {this.renderFilterControls(renderTree)}
        </Row>
      </div>
      {
        queryMode === GlobalControlQueryMode.Manually && (
          <div className={actionClass}>
            <Button type="primary" icon={<SearchOutlined />} onClick={this.manualSearch}>查询</Button>
            <Button icon={<ReloadOutlined />} onClick={this.reset}>重置</Button>
          </div>
        )
      }
    </Form>;
  }

}

export default Form.create<IFilterPanelProps & FormComponentProps>()(FilterPanel)
