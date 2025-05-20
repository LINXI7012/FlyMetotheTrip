// 调试脚本：检查localStorage中的攻略格式
function examineGuides() {
  // 获取所有保存的攻略
  const savedGuides = JSON.parse(localStorage.getItem("savedGuides") || "[]");
  console.log("Found", savedGuides.length, "guides in localStorage");
  
  if (savedGuides.length === 0) {
    console.log("没有找到任何攻略数据");
    return;
  }
  
  // 分析第一个攻略
  const firstGuide = savedGuides[0];
  console.log("示例攻略数据：");
  console.log("标题:", firstGuide.title || firstGuide.destination);
  console.log("描述:", firstGuide.overview || "无描述");
  
  // 检查dailyPlan结构
  if (!firstGuide.dailyPlan || firstGuide.dailyPlan.length === 0) {
    console.log("!!!错误: 攻略没有每日行程数据");
    console.log("dailyPlan属性:", firstGuide.dailyPlan);
    
    // 寻找其他可能包含行程的属性
    console.log("所有属性:", Object.keys(firstGuide));
    
    if (firstGuide.plan && firstGuide.plan.dailyPlan) {
      console.log("找到嵌套的dailyPlan:", firstGuide.plan.dailyPlan);
    }
    
    return;
  }
  
  // 分析每日行程格式
  console.log("每日行程项数:", firstGuide.dailyPlan.length);
  const firstDay = firstGuide.dailyPlan[0];
  console.log("第一天数据:", firstDay);
  console.log("第一天所有属性:", Object.keys(firstDay));
  
  // 分析活动格式
  if (firstDay.activities) {
    console.log("活动数据:", firstDay.activities);
    if (typeof firstDay.activities === 'string') {
      try {
        console.log("解析JSON后的活动:", JSON.parse(firstDay.activities));
      } catch (e) {
        console.log("无法解析活动JSON");
      }
    }
  }
  
  // 查找并打印所有可能包含详细时间信息的属性
  const timeProperties = ["morning", "noon", "evening", "morningActivity", "afternoonActivity", "eveningActivity", "上午", "中午", "晚上"];
  timeProperties.forEach(prop => {
    if (firstDay[prop]) {
      console.log(`${prop}:`, firstDay[prop]);
    }
  });
}

// 在控制台运行此函数以查看结果
examineGuides(); 