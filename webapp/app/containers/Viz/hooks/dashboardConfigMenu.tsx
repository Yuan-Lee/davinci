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

import React from 'react'

import { DeleteOutlined, EditOutlined, SwapOutlined } from '@ant-design/icons';

import { Menu } from 'antd';
const MenuItem = Menu.Item

import useProjectPermission from 'containers/Projects/hooks/projectPermission'

const useDashboardConfigMenu = (style: React.CSSProperties = {}) => {
  const EditMenuItem = useProjectPermission(MenuItem, 'vizPermission')
  const DeleteMenuItem = useProjectPermission(MenuItem, 'vizPermission', true)

  console.log(EditMenuItem, DeleteMenuItem)
  return (
    <Menu style={style}>
      <EditMenuItem key="edit"><EditOutlined />编辑</EditMenuItem>
      <EditMenuItem key="move"><SwapOutlined />移动</EditMenuItem>
      <DeleteMenuItem key="delete"><DeleteOutlined />删除</DeleteMenuItem>
    </Menu>
  );
}

export default useDashboardConfigMenu
