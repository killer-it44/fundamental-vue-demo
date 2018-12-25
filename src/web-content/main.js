window.onload = function () {

    fundamentalvue.default(Vue)

    const Overview = {
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
    }

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

    const Details = {
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
    }

    const app = new Vue({
        el: '#app',
        router: new VueRouter({
            routes: [
                { path: '/', component: Overview },
                { path: '/details/:id', component: Details },
                { path: '/create', component: Create }
            ]
        })
    })
}
