<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
   <div class="common-layout">
    <el-container>
      <el-header class="navigation" height="50px">
        <RouterLink to="/">SQL Editor</RouterLink>
      </el-header>
      <el-container>
        <RouterView />
      </el-container>
    </el-container>
  </div>
   
</template>

<style scoped>


.logo {
  display: block;
  margin: 0 auto 2rem;
}

.navigation {
  width: 100%;
  padding: 8px;
  font-size: 20px;
  /* margin-bottom: 20px; */
  background-color: black;
}

.navigation a.router-link-exact-active {
  color: white;
}

.navigation a.router-link-exact-active:hover {
  background-color: transparent;
}

.navigation a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {

  nav {
    text-align: left;
    font-size: 1rem;
  }
}
</style>
