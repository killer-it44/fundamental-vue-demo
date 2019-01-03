define({
    template: `
        <FdActionBar v-if="dataReady" :title="todo.text" :description="todo.description">
            <FdButton @click="$router.push('/')" slot="back" styling="light" compact icon="nav-back" />
            <FdButton v-if="todo.status != 'done'" @click="completed">Completed</FdButton>
        </FdActionBar>
    `,
    data: function () {
        return { dataReady: false }
    },
    created: async function () {
        const id = this.$route.params.id
        const response = await superagent.get(`/api/todos/${id}`)
        this.todo = response.body
        this.dataReady = true
    },
    methods: {
        completed: async function () {
            this.todo.status = 'done'
            await superagent.put(`api/todos/${this.todo.id}`).send(this.todo)
            this.$router.push('/')
        }
    }
})
