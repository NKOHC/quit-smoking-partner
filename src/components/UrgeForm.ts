// 冲动记录表单组件
export class UrgeForm {
    private form: HTMLFormElement;
    private urgeService: UrgeService;

    constructor(formId: string) {
        this.form = document.getElementById(formId) as HTMLFormElement;
        this.urgeService = new UrgeService();
        this.initializeForm();
    }

    private initializeForm() {
        this.form.innerHTML = `
            <div class="form-group">
                <label>烟瘾强度</label>
                <div class="intensity-slider">
                    <input type="range" min="1" max="10" value="5" id="intensitySlider">
                    <span id="intensityValue">5</span>
                </div>
            </div>
            <div class="form-group">
                <label>抽烟数量</label>
                <input type="number" min="1" id="countInput" value="1">
            </div>
            <div class="form-group">
                <label>备注说明</label>
                <textarea id="notesInput" placeholder="记录当前情况..."></textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="resistedInput">
                    成功抵制
                </label>
            </div>
            <button type="submit" class="submit-btn">保存记录</button>
        `;

        // 绑定事件
        const slider = document.getElementById('intensitySlider') as HTMLInputElement;
        const valueDisplay = document.getElementById('intensityValue');
        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    private async handleSubmit(e: Event) {
        e.preventDefault();
        
        const formData = {
            userId: '1', // TODO: 从登录状态获取
            timestamp: new Date(),
            intensity: parseInt((document.getElementById('intensitySlider') as HTMLInputElement).value),
            count: parseInt((document.getElementById('countInput') as HTMLInputElement).value),
            notes: (document.getElementById('notesInput') as HTMLTextAreaElement).value,
            resisted: (document.getElementById('resistedInput') as HTMLInputElement).checked
        };

        try {
            await this.urgeService.addUrgeRecord(formData);
            alert('记录成功！');
            this.form.reset();
        } catch (error) {
            alert('保存失败，请重试');
            console.error(error);
        }
    }
} 