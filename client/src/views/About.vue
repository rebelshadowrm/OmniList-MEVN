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
  <div class="test-container">
    <h2>test box</h2>
    <div class="test">
      <table>
        <thead>
          <tr>
            <th v-for="index_x in 11" :key="index_x"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="index_y in 11" :key="index_y">
            <td @click="(e) => {pos.x = parseInt(e?.target?.dataset?.x);
                                pos.y = parseInt(e?.target?.dataset?.y)}"
                :data-x="(index_x - 6)"
                :data-y="Math.abs(index_y - 11)"
                v-for="index_x in 11" :key="index_x">
              <span :class="(index_x - 6) === pos.x &&
                   Math.abs(index_y - 11) === pos.y ? 'active' : ''"
              >{{index_x - 6}}x, {{Math.abs(index_y - 11)}}y</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <span>{{pos}}<button @click="() => {pos.x = 0; pos.y = 0}">reset</button></span>

    <div class="buttons">
      <div class="top">
        <button @click="pos.y++">up</button>
      </div>
      <div class="middle">
        <button @click="pos.x--">left</button>
        <button @click="pos.x++">right</button>
      </div>
      <div class="bottom">
        <button @click="pos.y--">down</button>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  name: "About",
  data() {
    return {
      pos: {
        x: 0,
        y: 0
      }
    }
  }
}
</script>

<style scoped>
.active {
  display: inline-block;
  position: relative;
  color: transparent;
}
.active::after {
  display: inline-block;
  content: 'HERE';
  color: limegreen;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--txt-med);
  font-weight: 700;
}

.test-container {
  display: grid;
  place-items: center;
  padding: 1rem;
}
.test {
  margin-inline: auto;
  width: max-content;
  border: 1px solid hsl(0deg 0% 30%);
}
thead {
  display: none;
}
td span {
  pointer-events: none;
}
th,
tr,
tr td {
  font-size: var(--txt-small);
  font-weight: 500;
  aspect-ratio: 1;
  padding: 1rem .5rem;
  text-align: center;
  vertical-align: middle;
}
td {
  border: 1px inset hsl(0deg 0% 30%);
}
tr td:hover {
  background: hsl(0deg 0% 80% / .15);
  cursor: pointer;
}

.buttons {
  margin-block: 1rem;
  display: grid;
  place-items: center;
  gap: .25rem;
}
button {
  color: var(--clr-btn);
  background: var(--clr-btn-bg);
  border: var(--clr-border);
}


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