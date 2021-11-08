<template>
  <div>
    <Alert type="info">
      用户管理
      <template slot="desc">超管可以维护所有用户信息</template>
    </Alert>
    <Alert type="success">
      接口管理
      <template slot="desc">管理各系统间交互的接口</template>
    </Alert>
    <Alert type="warning">
      权限管理
      <template slot="desc">赋予特定IP或KEY访问API的权限</template>
    </Alert>
    <Alert type="error">
      日志查询
      <template slot="desc">各个API交互的历史记录查询</template>
    </Alert>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>