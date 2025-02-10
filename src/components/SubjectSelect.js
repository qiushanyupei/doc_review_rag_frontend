import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import SubjectIcon from '@mui/icons-material/Subject';

const SubjectSelect = ({ subjects, selected_subject_id, handleSubjectSelect }) => {
  return (
    <Box sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <SubjectIcon color="primary" sx={{ marginRight: '10px' }} />
        <Typography variant="h5">选择主题</Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          border: '1px solid #ddd',
          padding: '10px',
          borderRadius: '8px',
          background: '#ffffff',
          overflowY: 'auto',
          maxHeight: '30vh',
          minHeight: '20vh'
        }}
      >
        <Typography variant="body2" color="textSecondary">
          {/* 渲染从数据库获取的主题列表 */}
          {/* 主题列表中每个主题渲染为一个Box嵌套Button */}
          {/* "?." 是可选链操作符,在左侧对象为空时会终止操作，不会报错 */}
          {subjects?.map((subject) => (
            <Box key={subject.id} mb={2}>
              {/* mb是指margin bottom */}
              <Button 
                variant={selected_subject_id === subject.id ? "contained" : "outlined"} 
                // 根据是否选中来切换样式
                color={selected_subject_id === subject.id ? "primary" : "default"} 
                // 选中的按钮使用不同颜色
                onClick={() => handleSubjectSelect(subject)}
                //设置了主题，这样提交问题时只会检索对应主题下的向量
              >
                {/* 前面是Button样式，后面是Button内容：被渲染的主题名 */}
                {subject.subject_name}
              </Button>
            </Box>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};

export default SubjectSelect;
