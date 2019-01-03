const Create = {
    template: `
        <div>
            <FdFormSet>
                <FdFormItem>
                    <FdFormLabel>Text</FdFormLabel>
                    <FdInput v-model="text" placeholder="short text"/>
                </FdFormItem>
                <FdFormItem>
                    <FdFormLabel>Description</FdFormLabel>
                    <FdInput v-model="description" placeholder="description"/>
                </FdFormItem>
            </FdFormSet>
            <FdButton @click="save">Save ToDo</FdButton>
        </div>
    `,
    data: function () {
        return { text: '', description: '' }
    },
    methods: {
        save: async function () {
            this.$data.status = 'to do'
            await superagent.post('api/todos').send(this.$data)
            this.$router.push('/')
        }
    }
}
