/**
 * 类目相关的文档展示
 */
import React from 'react';
import CSSModules from 'react-css-modules';
import hljs from 'highlight.js'
import _ from 'lodash';
import mdData from 'md/index.js';
import 'styles/highlight.css';
import styles from './index.less';

@CSSModules(styles)
export default class CategoryFunc extends React.Component {
  componentDidMount() {
    this.hightLight();
  }

  componentDidUpdate() {
    this.hightLight();
  }

  // 代码高亮
  hightLight = () => {
    const preTags = document.getElementById('category-md').getElementsByTagName('pre');
    Array.from(preTags).forEach(item => hljs.highlightBlock(item));
  }

  render() {
    const mdKey = _.get(this.props, 'match.params.funcname') || 'generateTree';
    const matchMd = _.get(mdData, [mdKey]); // 匹配的markdown数据
    return (
      <div styleName="category-md" dangerouslySetInnerHTML={{ __html: matchMd }} id="category-md" />
    )
  }
}  