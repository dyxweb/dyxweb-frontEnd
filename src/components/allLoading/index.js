/**
 * 全局loading
 */
import React from 'react';
import { Spin } from 'antd';

const AllLoading = () => {
  return (
    <Spin tip="页面加载中...">
      <div style={{ width: '100%', height: 'calc(100vh - 60px)' }} />
    </Spin>
  )
}

export default AllLoading;