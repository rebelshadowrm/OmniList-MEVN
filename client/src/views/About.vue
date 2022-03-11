<template>
  <div class="container">
    <h1>About the project</h1>
    <dl>
      <dt>
        <span class="mongo">M</span>
        <span class="express">E</span>
        <span class="vue">V</span>
        <span class="node">N</span>
        Stack</dt>
      <dd class="mongo"><img alt="mongo" src="../assets/mongodb.png"/>Mongo DB<span class="mongoose">+ Mongoose<img alt="mongoose" src="../assets/mongoose.png"></span></dd>
      <dd class="express"><img alt="express" src="../assets/expressjs.svg">Express.js</dd>
      <dd class="vue"><img alt="vue" src="../assets/vue.svg"/>Vue + Vite<img alt="vite" src="../assets/vite.svg"></dd>
      <dd class="node"><img alt="node" src="../assets/node.svg"/>Node</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: "About"
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  place-items: center;
  gap: 2rem;
}
h1 {
  font-size: var(--txt-xlrg-fluid);
  border-bottom: 1px solid hsl(var(--clr-white-200));
}
dl {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
dt {
  font-size: 2rem;
  font-weight: 700;
}
dd {
  font-size: 1.5rem;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}
dd img {
  display: inline-block;
  aspect-ratio: 1;
  height: 3rem;
}
.mongo {
  color: #4DB33D;
}
.mongoose {
  color: #880000;
  align-self: center;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin-left: -.25rem;
}
.mongoose img{
  aspect-ratio: unset;
  height: 2rem;
}
.node {
  color: #68A063;
}
.vue {
  color: #41B883;
}
.express {
  color: royalblue;
}
.express img {
  background-color: royalblue;
  border-radius: 100%;
}

</style>