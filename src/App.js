import React,{ useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton,Button } from '@mui/material';
import {Description as DescriptionIcon, SmartToy as SmartToyIcon} from '@mui/icons-material';
import SubjectIcon from '@mui/icons-material/Subject';
import 'react-resizable/css/styles.css'; // 引入样式
import mammoth from 'mammoth'; // 用于解析 .docx 文档
import * as pdfjsLib from 'pdfjs-dist';
import axios from 'axios';
import ResizablePanel from './components/ResizablePanel';
import AiInteraction from './components/AiInteraction';
import SubjectSelect from './components/SubjectSelect';
import DocumentPreview from './components/DocumentPreview';

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [leftRatio, setLeftRatio] = useState(0.3); // 初始比例：左侧占 30%
  const [leftWidth, setLeftWidth] = useState(windowWidth * leftRatio); // 左侧宽度
  const [rightWidth, setRightWidth] = useState(windowWidth * (1 - leftRatio)); // 右侧宽度
  const [documentContent, setDocumentContent] = useState('这里将显示文档内容。'); // 左侧文档内容
  const [aiResponse, setAiResponse] = useState('AI反馈内容将在这里显示。'); // AI 的回答
  const [userQuestion, setUserQuestion] = useState(''); // 用户输入的问题
  const [loading, setLoading] = useState(false); // 加载状态
  const [question, setQuestion] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selected_subject_id, setSelected_Subject_Id] = useState(0);
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;


  // 动态监听窗口大小变化
  useEffect(() => {
      const handleResize = () => {
      const newWindowWidth = window.innerWidth;

      // 根据比例调整左右宽度
      setLeftWidth(newWindowWidth * leftRatio);
      setRightWidth(newWindowWidth * (1 - leftRatio));

      setWindowWidth(newWindowWidth); // 更新窗口宽度
      };

      //首次挂载到页面时会添加监视器，所以不用担心没有被初始化
      window.addEventListener('resize', handleResize);

      return () => {
      window.removeEventListener('resize', handleResize);
      };
  }, [leftRatio]);

  // 动态调整发给后端的问题
  //这块是整个把文档和问题连接起来
  //如果做的更精细应该分开
  useEffect(() => {
    setQuestion(userQuestion);
  }, [userQuestion]);

  //用于每隔5秒获取数据库更新好的主题信息
  useEffect(() => {
    const interval = setInterval(() => {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // 使用环境变量
      console.log(apiUrl);
      console.log(process.env.REACT_APP_API_URL);
      axios.get(`${apiUrl}/subjects`)
        .then(response => {
          setSubjects(response.data);
          console.log('Request success');
        })
        .catch(error => {
          console.error(error);
        });
    }, 5000);  // 每5秒钟请求一次
  
    // 清理定时器
    return () => clearInterval(interval);
  }, []); 

  // 拖动分隔条后更新比例和宽度
  //左侧ResizableBox的onResizeStop监听
  //即resize停止后进行更新
  //参数e是点击事件
  //data是包含尺寸和位置信息的对象
  const handleResizeStop = (e, data) => {
      const newLeftWidth = data.size.width;
      const newLeftRatio = newLeftWidth / window.innerWidth;

      setLeftRatio(newLeftRatio); // 更新比例
      setLeftWidth(newLeftWidth); // 更新左侧宽度
      setRightWidth(window.innerWidth - newLeftWidth); // 更新右侧宽度
  };

  //绑定于上传问题
  const handleQuestionSubmit = async () => {
    if (!userQuestion.trim()) {
      alert('请输入一个问题！');
      return;
    }

    if (selected_subject_id === 0){
      alert('请选择一个主题！');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // 使用环境变量
      const response = await fetch(`${apiUrl}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question,Id: selected_subject_id     }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.answer || '未收到有效的回答。');
      } else {
        setAiResponse('请求失败，请稍后再试。');
      }
    } catch (error) {
      console.error('Error:', error);
      setAiResponse('连接后端失败，请检查服务是否正常运行。');
    }

    setLoading(false);
  };

  // 文件上传处理
  //和文件上传按钮绑定
  //event是交互事件
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    //用于破解异步延迟的变量
    let newDocumentContent = '';

    // 支持多种文件类型的解析
    if (file.type === 'text/plain') {
      const text = await file.text(); // 读取纯文本文件
      newDocumentContent = text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      //arrayBuffer是转化成二进制数据
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      newDocumentContent = result.value; // 设置文档内容
    } else if(file.type === 'application/pdf'){
      const text = await extractPdfText(file);
      newDocumentContent = text; // 设置文档内容
    } else {
      alert('不支持的文件类型');
    }

    if (!newDocumentContent.trim()) {
      alert('请上传一个非空文档！');
      return;
    }

    //异步更新，有延迟
    setDocumentContent(newDocumentContent);

    try {
      console.log("fuck you")
      console.log(process.env.REACT_APP_API_URL)
      console.log("i like your ass")
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';  // 使用环境变量
      console.log(`${apiUrl}/upload`)
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentContent: newDocumentContent }),
      });

  //后面还得更改后端
    //后端返回什么？显示正常
    //   if (response.ok) {
    //     const data = await response.json();
    //     setAiResponse(data.answer || '未收到有效的回答。');
    //   } else {
    //     setAiResponse('请求失败，请稍后再试。');
    //   }
    } catch (error) {
      console.error('Error:', error);
      setAiResponse('连接后端失败，请检查服务是否正常运行。');
    }
  };

  // 解析 PDF 文件并提取文本
  const extractPdfText = async (file) => {
    //URL的那个函数是用来暂时访问file文件内容
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    let textContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map(item => item.str).join(' ');
      textContent += text + '\n'; // 合并每一页的文本
    }
    return textContent;
  };

  const handleSubjectSelect = (s_subject) => {
    setSelected_Subject_Id(s_subject.id)
  };

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(180deg, #f0f0f0, #ffffff)',
        padding: '20px',
        display: 'flex',
      }}
    >
      {/* 左侧区域：文档显示 */}
      <ResizablePanel leftWidth={leftWidth} windowWidth={windowWidth} handleResizeStop={handleResizeStop}>
        <DocumentPreview documentContent={documentContent} handleFileUpload={handleFileUpload} />
        {/* 下半部分：主题选择部分 */}
        {/* flex:1表示既能伸展又能收缩，如果为其他数字基本用不到，设置在总份中的比例 */}
        <SubjectSelect subjects={subjects} selected_subject_id={selected_subject_id} handleSubjectSelect={handleSubjectSelect}/>
      </ResizablePanel>

      {/* 右侧区域：AI交互区 */}
      <AiInteraction aiResponse={aiResponse} userQuestion={userQuestion}  setUserQuestion={setUserQuestion} handleQuestionSubmit={handleQuestionSubmit} loading = {loading}/>
    </Box>
  );
}

export default App;
