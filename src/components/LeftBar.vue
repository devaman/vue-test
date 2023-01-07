<template>
  <el-collapse model-value="1" style="margin-left:10px;">
        <el-collapse-item title="Sample Queries" name="1">
            <div>
            <el-button v-for="query in SampleQueries" :key="query" bg text @click="$emit('query-clicked',query)" type="primary" class="queries">{{query.charAt(0).toUpperCase()+query.substring(1)}}</el-button>
        </div>
 </el-collapse-item>
  </el-collapse>
</template>

<script setup>
import SampleQueries from '../constants/SampleQueries'
</script>

<style scoped>
.queries {
    display: block;
    width: 100%;
    margin-left: 0 !important;
    margin-bottom: 4px;
    text-align: left;
}

</style>