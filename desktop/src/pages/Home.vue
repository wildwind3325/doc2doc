<template>
  <div>
    <div style="margin-bottom: 5px;">
      <Button :type="status" @click="login">{{ statusText }}</Button>
      <Button type="primary" style="margin-left: 5px;">传输</Button>
    </div>
    <div style="margin-bottom: 5px;">
      <Breadcrumb separator=">">
        <BreadcrumbItem>
          <span class="link" @click="jump(-1)">我的空间</span>
        </BreadcrumbItem>
        <BreadcrumbItem v-for="(item, index) in subs" :key="index">
          <span class="link" @click="jump(index)">{{ item.name }}</span>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
    <Table border stripe :columns="columns" :data="items" @on-selection-change="selectItems">
      <template slot-scope="{ row, index }" slot="name">
        <span :class="row.type === 0 ? 'link' : ''" @click="navi(row)">{{ formatName(row) }}</span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary">传输</Button>
        <Button v-show="row.type !== 0" type="warning" style="margin-left: 5px;" @click="download(row)">下载</Button>
      </template>
    </Table>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      status: 'error',
      statusText: '未登录',
      session: '',
      subs: [],
      columns: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '名称',
        slot: 'name',
        width: 200,
        align: 'center'
      }, {
        title: '类型',
        key: 'type',
        width: 80,
        align: 'center'
      }, {
        title: '标签',
        key: 'tags'
      }, {
        title: '操作',
        slot: 'action',
        width: 180,
        align: 'center'
      }],
      items: [],
      checkedItems: []
    };
  },
  mounted() {
    let session = localStorage.getItem('session');
    if (session) {
      this.status = 'success';
      this.statusText = '已登录';
      this.session = session;
      this.refresh(-1);
    }
  },
  methods: {
    login() {
      if (this.status === 'error') {
        this.$Modal.confirm({
          render: (h) => {
            return h('Input', {
              props: {
                value: '',
                autofocus: true,
                placeholder: '粘贴session值'
              },
              on: {
                input: (val) => {
                  localStorage.setItem('session', val);
                  this.status = 'success';
                  this.statusText = '已登录';
                  this.session = val;
                  this.refresh(-1);
                }
              }
            })
          }
        });
      } else {
        this.$Modal.confirm({
          title: '确认',
          content: '是否退出当前登录信息',
          onOk: () => {
            localStorage.removeItem('session');
            this.status = 'error';
            this.statusText = '未登录';
            this.session = '';
            this.subs = [];
            this.items = [];
            this.checkedItems = [];
          }
        });
      }
    },
    jump(index) {
      if (!this.session || index === this.subs.length - 1) return;
      this.subs.splice(index + 1, this.subs.length - index - 1);
      this.refresh(index);
    },
    async refresh(index) {
      try {
        this.$Spin.show();
        let url = '/api/doc/home';
        let form = { session: this.session };
        if (index > -1) {
          url = '/api/doc/folder';
          form.token = this.subs[index].token;
        }
        let res = await this.$http.post(url, form);
        if (res.data.success) {
          this.items = res.data.rows;
        } else {
          this.$Message.error('获取列表失败：' + res.data.message);
        }
      } catch (err) {
        this.$Message.error('获取列表失败：' + err.message);
      } finally {
        this.$Spin.hide();
      }
    },
    formatName(row) {
      if (row.type === 0) {
        return '[' + row.name + ']';
      }
      return row.name;
    },
    navi(row) {
      if (row.type !== 0) return;
      this.subs.push(row);
      this.refresh(this.subs.length - 1);
    },
    download(row) {
      if (row.type === 12) {
        window.open('http://localhost:3000/api/doc/download/file?token=' + row.obj_token + '&session=' + encodeURIComponent(this.session) + '&filename=' + encodeURIComponent(row.name), '_blank');
      }
    },
    selectItems(selection) {
      this.checkedItems = selection;
    }
  }
};
</script>