<template>
   <div  >
        <div class="input" >
            <el-form :model="form" :rules="rules" ref="ruleFormRef">
                <div>
                    <el-button type="primary" plain @click="submitForm" icon="VideoPlay">
                        Run
                    </el-button>
                    <el-button type="primary" plain @click="cancelRequest" icon="Close">
                        Cancel
                    </el-button>
                </div>
                <br/>
                <el-form-item prop="query" >
                    <el-input type="textarea" v-model="form.query"/>
                </el-form-item>
                <el-form-item>
                </el-form-item>
            </el-form>
           
        </div>
        <el-tabs v-model="activeTab" v-loading="loading" element-loading-text="fetching data">
            <el-tab-pane label="Results" name="results" >
                <div v-if="data" >
                    <el-table  :data="pagedTableData"  table-layout="auto" stripe border @sort-change="sortMethod">
                        <el-table-column resizable sortable="custom"  in v-for="column in dataColumns" :key="column" :prop="column" :label="column"></el-table-column>
                    </el-table>
                    <el-pagination layout="prev, pager, next" :total="this.data.length" @current-change="setPage"></el-pagination>
                </div>
                <div v-else class="no-result">{{ resultMessage }}</div>
            </el-tab-pane>
            <el-tab-pane label="History" name="history">
                <ul>
                    <li v-for="(historyItem, index) in historyStore.history" :key="index">{{historyItem}}</li>
                </ul>
            </el-tab-pane>
        </el-tabs>
       
    </div>
</template>

<script>
import { useHistoryStore } from '../stores/history'
import csvToJson from '../utils/csvToJson'
import {cloneDeep} from 'lodash'
export default {
    setup(){
    const historyStore = useHistoryStore()
    return { historyStore }
  },
  created(){
    this.controller = new AbortController();
    this.signal = this.controller.signal;
  },
    data () {
        return {
            activeTab:'results',
            form: {
                query:'SELECT * FROM territories;'
            },
            currentPage:1,
            pageSize:10,
            rules:{
                query: [
                    { required: true, message: 'Please Enter some query to run', trigger: 'blur' },
                    { min: 3, message: 'Length should be 3', trigger: 'blur' },
                ],
            },
            data:null,
            filteredData: null,
            loading: false,
            resultMessage:'Run the Query to see Results'
        };
    },
    computed:{
        dataColumns(){
            return Object.keys(this.data[0])
        },
        pagedTableData() {
            return this.filteredData.slice(this.pageSize * this.currentPage - this.pageSize, this.pageSize * this.currentPage)
        }
    },
    methods:{
        sortMethod({ prop, order }){
            let setVal = null
            if(order==='ascending'){
                setVal =1
            }
            if(order==='descending'){
                setVal =-1
            }

            if(setVal===null) this.filteredData = this.data
            else this.filteredData = cloneDeep(this.data).sort((a,b)=>{
                if(order==='ascending') return a[prop].toLowerCase().localeCompare(b[prop].toLowerCase())
                else return (b[prop].toLowerCase().localeCompare(a[prop].toLowerCase()))
            })
            
        },
        cancelRequest(){
            this.controller.abort()
            this.controller = new AbortController();
            this.signal = this.controller.signal;
        },
        submitForm(){
            this.$refs['ruleFormRef'].validate(async (valid)=>{
                if(!valid) return
                this.loading = true
                this.data=null
                this.filteredData =null
                this.currentPage = 1
                let payload = this.form.query.toLowerCase().split('select * from')[1].split(';')[0].trim()
                try{
                    await this.getData(payload)
                    this.historyStore.addToHistory(this.form.query)
                } catch(err){
                    if (err.name === "AbortError") {
                        this.resultMessage = 'Last Request was Aborted'
                    } else alert('error occurred while fetching data')
                } finally{
                    this.loading = false
                }
            })
        },
        async getData(name) {
            let data = await fetch (`https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/${name}.csv`, {signal:this.signal})
            data  = await data.text()
            data = csvToJson(data)
           this.data = data
           this.filteredData =data
        },
        setQuery(val) { 
            this.form.query = `SELECT * FROM ${val}`
        },
        setPage(val){
            this.currentPage =val
        }
    }
}
</script>

<style>
.input{
    display: flex;
    flex-grow: 1;
}
.input form{
    flex: 1;
}
.input ul{
    flex: 1;
}
.no-result{
    min-width: 100px;
}

</style>