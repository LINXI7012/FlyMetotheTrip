// 重置和初始化localStorage中的旅行计划数据
(function() {
    console.log('正在重置和初始化localStorage中的旅行计划数据...');
    
    // 创建默认旅行攻略数据
    const defaultGuides = [
        {
            id: 1001,
            createdAt: new Date().toISOString(),
            title: "京都之旅",
            destination: "京都，日本",
            duration: "7",
            season: "秋季",
            overview: "体验传统日本文化的完美之旅",
            highlights: [
                "伏见稻荷大社",
                "岚山竹林",
                "金阁寺",
                "祗园区"
            ],
            dailyPlan: [
                { day: 1, activity: "抵达并安顿", location: "京都站" },
                { day: 2, activity: "寺庙之旅", location: "东京都" },
                { day: 3, activity: "文化探索", location: "祗园和市中心" },
                { day: 4, activity: "自然之日", location: "岚山" },
                { day: 5, activity: "历史探索", location: "北京都" },
                { day: 6, activity: "美食之旅", location: "锦市场及周边" },
                { day: 7, activity: "最终观光和离开", location: "南京都" }
            ],
            notes: "这是一个自动创建的默认旅行计划"
        },
        {
            id: 1002,
            createdAt: new Date().toISOString(),
            title: "巴黎之旅",
            destination: "巴黎，法国",
            duration: "5",
            season: "春季",
            overview: "浪漫之都的艺术与美食探索",
            highlights: [
                "埃菲尔铁塔",
                "卢浮宫",
                "巴黎圣母院",
                "蒙马特高地"
            ],
            dailyPlan: [
                { day: 1, activity: "抵达并游览塞纳河", location: "市中心" },
                { day: 2, activity: "艺术之旅", location: "卢浮宫" },
                { day: 3, activity: "城市地标", location: "埃菲尔铁塔" },
                { day: 4, activity: "历史探索", location: "巴黎圣母院" },
                { day: 5, activity: "购物与离开", location: "香榭丽舍大街" }
            ],
            notes: "这是一个自动创建的默认旅行计划"
        }
    ];
    
    // 清除并重置localStorage
    localStorage.setItem('savedGuides', JSON.stringify(defaultGuides));
    
    console.log('localStorage已重置，包含', defaultGuides.length, '个旅行计划');
    alert('旅行计划数据已重置，请刷新页面查看！');
})(); 