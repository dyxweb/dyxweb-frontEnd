/**
 * 类目相关的文档展示
 */
import React from 'react';
import _ from 'lodash';
import ReactMarkdown from 'react-markdown';
import mdData from 'md/index.js';
import HighLightCode from 'components/highlightCode';

export default class CategoryFunc extends React.Component {
  render() {
    const mdKey = _.get(this.props, 'match.params.funcname') || 'generateTree';
    const matchMd = _.get(mdData, [mdKey]); // 匹配的markdown数据
    return (
      <div>
        <ReactMarkdown
          source={matchMd}
          renderers={{
            code: HighLightCode,
          }}
        />
      </div>
    )
  }
}  