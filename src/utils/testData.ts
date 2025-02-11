export const createTestGoal = () => ({
    id: 'test_goal_1',
    startDate: new Date(),
    targetDays: 30,
    cigarettesPerDay: 20,
    pricePerPack: 20,
    status: 'active' as const,
    lastUpdated: new Date()
});

export const createTestUrge = () => ({
    id: 'test_urge_1',
    timestamp: new Date(),
    intensity: 7,
    mood: 'stressed',
    notes: '测试记录',
    isResisted: true,
    syncStatus: 'pending' as const
}); 