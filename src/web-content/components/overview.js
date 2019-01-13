define({
    template: `
        <div>
            <FdTable v-if="dataReady" selectionMode="single" :data="todos">
                <FdTableColumn label="Status">
                    <template slot-scope="scope">
                        <div @click="toggleStatus(scope.row)">
                            <FdStatus :statusIcon="scope.row.status === 'done' ? 'available' : 'away'"/>
                        </div>
                    </template>
                </FdTableColumn>
                <FdTableColumn label="Text">
                    <template slot-scope="scope">
                        <div @focusin="focusText(scope.row)">
                            <FdSearchInput v-model="scope.row.text" @search="typeText">
                                <FdMenuItem v-for="item in suggestions" @click="selectSuggestion(item.text)">{{item.text}}</FdMenuItem>
                            </FdSearchInput>
                        </div>
                    </template>
                </FdTableColumn>
                <FdTableColumn label="Description">
                    <template slot-scope="scope">
                        <FdInput v-model="scope.row.description" @input="typeDescription(scope.row)"/>
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
        return { dataReady: false, suggestions: [] }
    },
    created: async function () {
        const response = await superagent.get('/api/todos')
        this.todos = response.body
        this.typeTimeout = null
        this.dataReady = true
    },
    methods: {
        focusText: function (todo) {
            // REVISE this is a workaround:
            // FdSearchInput doesn't work as documented, the "value" property is not available
            // so therefore we have to keep track of the current element, so that lateron typing event we can update
            // Another workaround would probably be to use Vue refs
            this.currentTodo = todo
            this.fetchSuggestions(todo.text)
        },
        typeDescription: function (todo) {
            this.debounce(async () => await this.update(todo))
        },
        typeText: function (searchText) {
            this.currentTodo.text = searchText
            this.debounce(() => Promise.all([this.update(this.currentTodo), this.fetchSuggestions(searchText)]))
        },
        selectSuggestion: function (selectedText) {
            this.currentTodo.text = selectedText
            this.debounce(() => this.update(this.currentTodo))
        },
        debounce: function (callback) {
            clearTimeout(this.typeTimeout)
            this.typeTimeout = setTimeout(callback, 300)
        },
        toggleStatus: async function (todo) {
            todo.status = todo.status === 'done' ? 'to do' : 'done'
            await this.update(todo)
        },
        create: function () {
            this.$router.push('/create')
        },
        update: async function (todo) {
            await superagent.put(`api/todos/${todo.id}`).send(todo)
        },
        fetchSuggestions: async function (searchText) {
            const suggestionsResponse = await superagent.get(`api/todos/suggestions/${searchText}`)
            const foundTodos = suggestionsResponse.body
            this.suggestions = (foundTodos.length > 0) ? foundTodos.slice(0, 6) : [{ text: searchText }]
        }
    }
})
