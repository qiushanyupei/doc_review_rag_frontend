import { Box, Typography, TextField, IconButton} from '@mui/material';
import {SmartToy as SmartToyIcon} from '@mui/icons-material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircularProgress from '@mui/material/CircularProgress';

const AiInteraction = ({aiResponse,userQuestion,setUserQuestion,handleQuestionSubmit,loading }) =>{

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: '#fafafa',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        //自动充满父容器
        flex: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <SmartToyIcon color="primary" sx={{ marginRight: '10px' }} />
        <Typography variant="h5">
          AI交互区
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          border: '1px solid #ddd',
          padding: '10px',
          borderRadius: '8px',
          background: '#ffffff',
          overflowY: 'auto',
        }}
      >
        <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-wrap' }}>
          {aiResponse}
        </Typography>
      </Box>

      {/* 输入框和发送图标按钮 */}
      {/* flex默认是水平排布 */}
      {/* gap表示两个相邻组件之间的间距 */}
      <Box sx={{ marginTop: '20px', display: 'flex', gap: 2 }}>
        <TextField
          label="输入内容"
          variant="outlined"
          fullWidth
          size="small"
          placeholder="在这里输入想分析的内容"
          value={userQuestion}
          onChange={(e)=>setUserQuestion(e.target.value)}
        />
        <IconButton
          size="large"
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            ':hover': {
              backgroundColor: '#115293',
            },
          }}
          onClick={handleQuestionSubmit}
          //disabled=true时不能点击
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> :<ArrowForwardIcon sx={{ transform: 'rotate(-90deg)' }}/>}
        </IconButton>
      </Box>
    </Box>
  );
};

export default AiInteraction;