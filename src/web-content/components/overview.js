define({
    template: `
        <div>
            <FdTable v-if="dataReady" selectionMode="single" :data="todos">
                <FdTableColumn label="Text">
                    <template slot-scope="scope">
                        <router-link :to="'details/' + scope.row.id">{{ scope.row.text }}</router-link>
                    </template>
                </FdTableColumn>
                <FdTableColumn label="Status">
                    <template slot-scope="scope">
                        <FdStatus :statusIcon="scope.row.status === 'done' ? 'available' : 'away'">{{ scope.row.status }}</FdStatus>
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
        create: function () {
            this.$router.push('/create')
        }
    }
})
