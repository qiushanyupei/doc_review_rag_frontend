import React from 'react';
import { Box, Typography,Button } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

const DocumentPreview = ({ documentContent,handleFileUpload }) => {
  return (
    <Box sx={{ flex: 1, marginBottom: '20px' }}>
          {/* alignItems: 'center'是垂直对齐子元素 */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            {/* DescriptionIcon就是文件图标 */}
            <DescriptionIcon color="primary" sx={{ marginRight: '10px' }} />
            <Typography variant="h5">
              文档预览
            </Typography>
          </Box>
          <Box
            //sx是MUI中的样式配置方法
            sx={{
              //flex:1是自动充满父容器
              flex: 1,
              border: '1px solid #ddd',
              padding: '10px',
              borderRadius: '8px',
              background: '#ffffff',
              overflowY: 'auto',
              maxHeight: '30vh',
              minHeight: '30vh'
            }}
          >
            <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {documentContent}
            </Typography>
            {/* 本来想用TextField替代Typography的，但是文本框高度设置出现问题，总是超出Box范围 */}
            {/* <TextField
              multiline
              fullWidth
              minRows={5}
              variant="standard"
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)} // 更新预览内容
              sx={{
                whiteSpace: 'pre-wrap', // 保留格式
                wordWrap: 'break-word',
                '& .MuiInput-underline:before': {
                  borderBottom: 'none', // 去掉默认的底部边界线
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottom: 'none', // 去掉 hover 状态下的底部边界线
                },
                '& .MuiInput-underline:after': {
                  borderBottom: 'none', // 去掉聚焦状态下的底部边界线
                },
              }}
            /> */}
          </Box>
          {/* variant是MUI中控制外观样式的属性 */}
          {/* component=‘label’是通过button联动触发input */}
          <Button variant="outlined" component="label" sx={{ marginTop: '20px' }}>
            上传文件
            <input
              type="file"
              hidden
              accept=".txt,.docx,.pdf"
              onChange={handleFileUpload}
            />
          </Button>
        </Box>
  );
};

export default DocumentPreview;
