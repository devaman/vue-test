<template>
    <el-aside width="200px">
        <LeftBar @query-clicked="setQuery" />
    </el-aside>
    <el-tabs v-model="editableTabsValue" type="card" editable class="demo-tabs" @edit="handleTabsEdit">
        <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name" ref="elements">
            <Runner :ref="`runner-${item.name}`" />
        </el-tab-pane>
    </el-tabs>
</template>
<script>
import { ref } from 'vue'
import Runner from '../components/Runner.vue';
import LeftBar from '../components/LeftBar.vue';
export default {
    components:{LeftBar, Runner},
    data() {
        return {
            editableTabsValue: '1',
            editableTabs: [
                {
                    title: 'Tab 1',
                    name: '1',
                },
                {
                    title: 'Tab 2',
                    name: '2',
                },
            ],
        }
    },
    created() {
        this.tabIndex = 2
    },
    methods: {
        handleTabsEdit(targetName, action) {
            if (action === 'add') {
                const newTabName = `${++this.tabIndex}`
                this.editableTabs.push({
                    title: 'New Tab',
                    name: newTabName,
                })
                this.editableTabsValue = newTabName
            } else if (action === 'remove') {
                const tabs = this.editableTabs
                let activeName = this.editableTabsValue
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            const nextTab = tabs[index + 1] || tabs[index - 1]
                            if (nextTab) {
                                activeName = nextTab.name
                            }
                        }
                    })
                }

                this.editableTabsValue = activeName
                this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
            }
        },
        setQuery(val) {
            console.log(this.$refs[`runner-${this.editableTabsValue}`])
            this.$refs[`runner-${this.editableTabsValue}`][0].setQuery(val)
            // elements.value[0].$slots.default()[0].setQuery(val)
        }
    }
}
</script>
<style>
.demo-tabs {
   flex: 1;
   padding: 10px;
}
</style>
