/**
 * 面试技术点相关的文档展示
 */
import React from 'react';
import CSSModules from 'react-css-modules';
import { Message } from 'antd';
import hljs from 'highlight.js'
import lodashGet from 'lodash.get';
import showdown from 'showdown';
import styles from './index.less';

const converter = new showdown.Converter();
const mdData = require.context('../../md/interview', true, /\.md$/).keys().map(item => {
	const itemArr = item.split('/')
	if (itemArr.length === 3) {
		const firstKey = itemArr[1]
		const secondKey = itemArr[2].replace('.md', '')
		return { key: `/interview/${firstKey}/${secondKey}`, label: `${firstKey}/${secondKey}` }
	}
})
@CSSModules(styles)
export default class Interview extends React.Component {
	componentDidMount() {
		this.hightLight();
	}

	componentDidUpdate() {
		const rightContent = document.querySelector('.right-content');
		if (rightContent) {
			rightContent.scrollTop = 0
		}
		this.hightLight();
	}

	componentWillUnMount() {
		Array.from(document.querySelectorAll('.pre-code')).removeEventListener('click', this.copyCode);
	}

	// 复制代码
	copyCode = (codeDom) => {
		const code = codeDom && codeDom.innerText;
		if (navigator.clipboard) {
			navigator.clipboard.writeText(code).then(() => {
				Message.success("复制成功");
			},  (err) => {
				Message.error("复制失败");
			});
		} else {
			const textArea = document.createElement("textarea");
			textArea.value = code;
			textArea.style.position = "fixed";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				const successful = document.execCommand('copy');
				const msg = successful ? 'successful' : 'unsuccessful';
				Message.success("复制成功");
			} catch (err) {
				Message.error("复制失败");
			}
			document.body.removeChild(textArea) 
		}
	};

	// 代码高亮
	hightLight = () => {
		const preTags = document.getElementById('category-md').getElementsByTagName('pre');
		var divTag = document.createElement("div");
		divTag.setAttribute("class", "pre-code");
		divTag.innerText = '复制';
		(Array.from(preTags) || []).forEach(item => {
			item.setAttribute("style", "position: relative");
			item.appendChild(divTag);
			hljs.highlightBlock(item)
		});
		Array.from(document.querySelectorAll('.pre-code')).forEach(item => item.addEventListener('click', () => this.copyCode(item.previousSibling)));
	}

	// 跳转到指定文章
	jump = index => {
    this.props.history.push(mdData[index].key)
	}

	render() {
	  const classification = lodashGet(this.props, 'match.params.classification');
	  const name = lodashGet(this.props, 'match.params.name');
    const currentIndex = mdData.findIndex(item => item.label === `${classification}/${name}`)
		let nextIndex = currentIndex + 1
		let prevIndex = currentIndex - 1
		// 最后一个
		if (currentIndex === mdData.length - 1) {
      nextIndex = 0;
		}

		// 第一个
		if (currentIndex === 0) {
      prevIndex = mdData.length - 1;
		}

		return (
			<div styleName="content">
				<div styleName="top">
					<div onClick={() => this.jump(prevIndex)}>上一篇：{mdData[prevIndex].label}</div>
					<div onClick={() => this.jump(nextIndex)}>下一篇：{mdData[nextIndex].label}</div>
				</div>
				<div styleName="category-md" dangerouslySetInnerHTML = {{ __html: converter.makeHtml(require(`../../md/interview/${classification}/${name}.md`).default) }} id="category-md" />
			</div>
		)
	}
}  