<template>
  <div>
    <Layout style="height: 100vh;">
      <Header>
        <Menu ref="menu" mode="horizontal" theme="dark" :active-name="activeName" @on-select="selectMenu">
          <MenuItem name="/">
          <Icon type="ios-home" />首页
          </MenuItem>
        </Menu>
      </Header>
      <Content style="padding: 20px 40px;">
        <router-view></router-view>
      </Content>
    </Layout>
  </div>
</template>

<script>
export default {
  name: 'Master',
  data() {
    return {
      activeName: ''
    };
  },
  mounted() {
    this.activeName = this.$route.path;
    this.$nextTick(() => {
      this.$refs.menu.updateActiveName();
    });
  },
  methods: {
    selectMenu(name) {
      if (name === this.activeName) {
        location.reload();
        return;
      }
      this.activeName = name;
      this.$router.push(name);
    }
  }
};
</script>