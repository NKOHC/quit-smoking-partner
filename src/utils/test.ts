export async function runTests() {
    console.group('开始功能测试');
    
    // 1. 测试 LocalStorage
    console.log('测试 LocalStorage 可用性...');
    try {
        localStorage.setItem('test', 'ok');
        localStorage.getItem('test');
        localStorage.removeItem('test');
        console.log('✅ LocalStorage 正常');
    } catch (error) {
        console.error('❌ LocalStorage 异常:', error);
    }

    // 2. 测试数据存储
    console.log('测试数据存储...');
    const goalStorage = new GoalStorage();
    const urgeStorage = new UrgeStorage();

    try {
        const testGoal = createTestGoal();
        await goalStorage.saveGoal(testGoal);
        const savedGoal = await goalStorage.getGoal();
        console.log('✅ 目标数据存储正常:', savedGoal);
    } catch (error) {
        console.error('❌ 目标数据存储异常:', error);
    }

    // 3. 测试组件渲染
    console.log('测试组件渲染...');
    const containers = ['goalContainer', 'urgeForm', 'statsContainer'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            console.log(`✅ 找到容器: ${id}`);
        } else {
            console.error(`❌ 找不到容器: ${id}`);
        }
    });

    console.groupEnd();
} 