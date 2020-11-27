import React, { Component } from 'react';
import { Button } from 'antd';
import _ from 'lodash';
import request from 'utils/request';

const SIZE = 10 * 1024 * 1024; // 切片大小
export default class UploadFile extends Component {
  state = {
		uploadFile: null, // 需要上传的文件
		chunkData: [], // 文件切片数据
	}
	
	// 上传控件改变之后保存文件信息
	fileChange = (e) => {
		const [file] = e.target.files;
		this.setState({
			uploadFile: file,
		});
	}

	// 生成文件切片
	createFileChunk = (file, size = SIZE) => {
		const fileChunkList = [];
		let cur = 0;
		while (cur < file.size) {
			fileChunkList.push({ file: file.slice(cur, cur + size) });
			cur += size;
		}
		return fileChunkList;
	}

	// 上传切片
	uploadChunks = () => {
		const { chunkData, uploadFile } = this.state;
		const requestList = chunkData.map(({ chunk, hash }) => {
			const formData = new FormData();
			formData.append("chunk", chunk);
			formData.append("hash", hash);
			formData.append("filename", uploadFile.name);
			request.post(`${QUERYHOST}/upload`, { name: 'dyx' });
			// return formData;
		});
		// requestList.map(formData => {
		// 	request.upload(formData);
		// });
		// Promise.all(requestList); // 并发切片
	}

	// 点击上传
	handleUpload = () => {
		const { uploadFile } = this.state;
		if (!uploadFile) return;
		const fileChunkList = this.createFileChunk(uploadFile);
		const chunkData = fileChunkList.map(({ file }, index) => ({
			chunk: file,
			hash: uploadFile.name + "-" + index // 文件名 + 数组下标
		}));
		this.setState({
			chunkData,
		}, () => {
			this.uploadChunks();
		})
	}


  render() {
		const { uploadFile } = this.state;
    return (
      <div>
        <input type="file" onChange={this.fileChange} />
				<Button type="primary" onClick={this.handleUpload} disabled={!uploadFile}>上传文件</Button>
      </div>
    );
  }
}
