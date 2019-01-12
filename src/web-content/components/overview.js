define({
    template: `
        <div>
            <FdTable v-if="dataReady" selectionMode="single" :data="todos">
                <FdTableColumn label="Status">
                    <template slot-scope="scope">
                        <div @click="flipStatus(scope.row)">
                            <FdStatus :statusIcon="scope.row.status === 'done' ? 'available' : 'away'"/>
                        </div>
                    </template>
                </FdTableColumn>
                <FdTableColumn label="Text">
                    <template slot-scope="scope">
                        <div @focusout="updateContent(scope.row)"><FdInput v-model="scope.row.text"/></div>
                    </template>
                </FdTableColumn>
                <FdTableColumn label="Description">
                    <template slot-scope="scope">
                        <div @focusout="updateContent(scope.row)"><FdInput v-model="scope.row.description"/></div>
                    </template>
                </FdTableColumn>
                <FdTableColumn label="Details">
                    <template slot-scope="scope">
                        <router-link :to="'details/' + scope.row.id">details</router-link>
                    </template>
                </FdTableColumn>
            </FdTable>
            <FdButton @click="create()">Create</FdButton>
        </div>
    `,
    data: function () {
        return { dataReady: false }
    },
    created: async function () {
        const response = await superagent.get('/api/todos')
        this.todos = response.body
        this.dataReady = true
    },
    methods: {
        flipStatus: async function (todo) {
            todo.status = todo.status === 'done' ? 'to do' : 'done'
            await superagent.put(`api/todos/${todo.id}`).send(todo)
        },
        create: function () {
            this.$router.push('/create')
        },
        updateContent: async function (todo) {
            await superagent.put(`api/todos/${todo.id}`).send(todo)
        }
    }
})
