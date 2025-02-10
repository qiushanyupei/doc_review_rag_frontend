import React,{ useState, useEffect } from 'react';
import { ResizableBox } from 'react-resizable';

const ResizablePanel = ({leftWidth,windowWidth, handleResizeStop,children }) => {

  return (
    <ResizableBox
        //width会根据leftWidth的值动态渲染
        width={leftWidth}
        height={Infinity}
        //以下只能水平拖动
        axis="x"
        //constraint[宽度，高度]
        minConstraints={[windowWidth * 0.2, 100]} // 最小宽度限制 20%
        maxConstraints={[windowWidth * 0.8, Infinity]} // 最大宽度限制 80%
        //e代指east,可以从右边拖动边界
        //不过有偏移量所以也无所谓
        resizeHandles={['e']}
        onResizeStop={handleResizeStop}
        //handle是拖动的把手
        handle={
            <div
            style={{
                width: '100px', // 拖动区域宽度
                height: '100%',
                position: 'absolute',
                top: 0,
                right: -50,
                cursor: 'ew-resize', // 鼠标指针样式
                zIndex: 10,
                backgroundColor: 'transparent', // 可选：设为透明
            }}
            />
        }
        style={{
            backgroundColor: '#fafafa',
            borderRadius: '10px',
            //参数解释
            //水平偏移、垂直偏移、模糊半径、阴影颜色和透明度
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            //内边距（和内部组件的距离）
            padding: '20px',
            display: 'flex',
            //元素垂直排布
            flexDirection: 'column',
            //外边距
            marginRight: '20px',
        }}
    >
      {children}
    </ResizableBox>
  );
};

export default ResizablePanel;
