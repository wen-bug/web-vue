<template>
  <div>
    <div id="findsp">
      <a-tabs v-model:activeKey="activeKey" @change="change">
        <a-tab-pane key="1" tab="文章">
          <a-list item-layout="vertical" :data-source="blogs">
            <template #loadMore>
              <div
                :style="{
                  textAlign: 'center',
                  marginTop: '12px',
                  height: '32px',
                  lineHeight: '32px',
                }"
              >
                <a-button v-if="blogs_more" @click="loadMore('blogs')"
                  >更多</a-button
                >
              </div>
            </template>
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <span>
                    <eye-outlined />
                    {{ item.view }}
                  </span>
                </template>
                <a-list-item-meta :description="item.brief">
                  <template #title>
                    <a @click="get_blog(item.id)">{{ item.title }}</a>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>

        <a-tab-pane key="2" tab="用户" force-render>
          <a-list item-layout="horizontal" :data-source="user">
            <template #loadMore v-if="user_more">
              <div
                :style="{
                  textAlign: 'center',
                  marginTop: '12px',
                  height: '32px',
                  lineHeight: '32px',
                }"
              >
                <a-button v-if="user_more" @click="loadMore('user')"
                  >更多</a-button
                >
              </div>
            </template>

            <template #renderItem="{ item, index }">
              <a-list-item>
                <template #extra>
                  <a-button
                    v-if="item.watch == 'true'"
                    type="primary"
                    @click="over(item.Account, index)"
                    >已关注</a-button
                  >
                  <a-button
                    v-else-if="this.$store.state.lives"
                    type="primary"
                    @click="to_watch(item.Account, index)"
                    >关注</a-button
                  >
                  <a-button v-else type="primary" @click="to_login"
                    >关注</a-button
                  >
                </template>
                <a-list-item-meta :description="item.sign">
                  <template #avatar>
                    <a-avatar
                      size="large"
                      :src="this.$store.state.host[0] + '/' + item.headP"
                    />
                  </template>
                  <template #title>
                    <a @click="user_home(item)">{{ item.userName }}</a>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { EyeOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    EyeOutlined,
  },
  data() {
    return {
      activeKey: '1',
      blog_page: 0,
      user_page: 0,
      blogs: [],
      user: [],
      blogs_more: false,
      user_more: false,
    };
  },
  watch: {
    "$store.state.finds": {
      deep: true,
      handler: function () {
        if (this.activeKey == 1) {
          this.to_findb();
        } else {
          this.to_findu(0);
        }
      },
    },
  },
  created() {
    if (this.$store.state.finds != "") {
      this.axios
        .post(this.$store.state.host[0] + "/find_blog", {
          page: 0,
          find: this.$store.state.finds,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            this.blogs = res.data[1].msg;
            var len = Object.keys(res.data[1].msg).length;
            if (len < 10) {
              this.blogs_more = false;
            } else {
              this.blogs_more = true;
            }
          }
          if (res.data[0].code == 1) {
            this.blogs_more = false;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      this.blogs_more = false;
    }
  },
  methods: {
    to_login() {
      message.warning("请登录");
    },
    to_findu(val) {
      if (val != 0) {
        this.user_page += val;
      } else {
        this.user_page = 0;
      }
      var account = "";
      if (this.$store.state.lives) {
        account = this.$store.state.lives.Account;
      }
      this.axios
        .post(this.$store.state.host[0] + "/get_user", {
          page: this.user_page,
          find: this.$store.state.finds,
          account: account,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            this.user = res.data[1].msg;
            var len = Object.keys(res.data[1].msg).length;
            if (len < 10) {
              this.user_more = false;
            } else {
              this.user_more = true;
            }
          } else if (res.data[0].code == -1) {
            message.warning("请求异常");
          }
        })
        .catch((e) => {
          message.warning("网络异常");
          this.blogs_more = false;
          console.log(e);
        });
    },
    to_findb() {
      if (this.$store.state.finds != "") {
        this.axios
          .post(this.$store.state.host[0] + "/find_blog", {
            page: 0,
            find: this.$store.state.finds,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data[0].code == 0) {
              this.blogs = res.data[1].msg;
              var len = Object.keys(res.data[1].msg).length;
              if (len < 10) {
                this.blogs_more = false;
              } else {
                this.blogs_more = true;
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    over(id, index) {
      this.axios
        .post(this.$store.state.host[0] + "/overlook", {
          star: id,
          account: this.$store.state.lives.Account,
          token:this.$store.state.lives.token
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            message.warning("取消关注");
            this.user[index].watch = false;
          }
        })
        .catch((e) => {
          message.warning("网络异常");
          console.log(e);
        });
    },
    to_watch(id, index) {
      if (id == this.$store.state.lives.Account) {
        message.warning("不能关注自己");
      } else {
        this.axios
          .post(this.$store.state.host[0] + "/to_watch", {
            star: id,
            account: this.$store.state.lives.Account,
            token:this.$store.state.lives.token
          })
          .then((res) => {
            console.log(res.data);
            if (res.data[0].code == 0) {
              message.warning("关注");
              this.user[index].watch = true;
            } else if (res.data[0].code == 26) {
              message.warning("已关注");
              this.user[index].watch = true;
            } else if (res.data[0].code == -1) {
              message.warning("异常");
            } else if (res.data[0].code == 29) {
              message.warning("不能关注自己");
            }
          })
          .catch((e) => {
            message.warning("网络异常");
            console.log(e);
          });
      }
    },
    get_blog(v) {
      this.$store.state.blogID = v;
      this.$router.push({ path: "/blogs" });
    },
    user_home(item) {
      this.$store.state.blogID = item;
      this.$router.push({ path: "/myCenter" });
    },
    loadMore(val) {
      if (val == "blogs") {
        this.blog_page += 10;
        this.axios
          .post(this.$store.state.host[0] + "/find_blog", {
            page: this.blog_page,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data[0].code == 0) {
              this.blogs.push(res.data[1].msg);
              var len = Object.keys(res.data[1].msg).length;
              if (len < 10) {
                this.blogs_more = false;
              } else {
                this.blogs_more = true;
              }
            } else if (res.data[0].code == 1) {
              this.blogs_more = false;
            }
          })
          .catch((e) => {
            message.warning("网络异常");
            console.log(e);
          });
      }
      if (val == "user") {
        this.to_findu(10);
      }
    },
    change() {
      switch (this.activeKey) {
        case "1":
          if (this.$store.state.finds == "") {
            message.warning("不能为空");
          } else {
            this.blog_page = 0;
            this.axios
              .post(this.$store.state.host[0] + "/find_blog", {
                page: this.blog_page,
                find: this.$store.state.finds,
              })
              .then((res) => {
                console.log(res.data);
                if (res.data[0].code == 0) {
                  this.blogs = res.data[1].msg;
                  var len = Object.keys(res.data[1].msg).length;
                  if (len < 10) {
                    this.blogs_more = false;
                  } else {
                    this.blogs_more = true;
                  }
                } else if (res.data[0].code == -1) {
                  message.warning("请求异常");
                }
              })
              .catch((e) => {
                message.warning("网络异常");
                this.blogs_more = false;
                console.log(e);
              });
          }

          break;
        case "2":
          if (this.$store.state.finds == "") {
            message.warning("不能为空");
            this.user_more = false;
          } else {
            this.to_findu(0);
          }
          break;
      }
    },
  },
  setup() {},
};
</script>

<style lang='less'>
#findsp {
  margin: auto;
  width: 900px;
  .ant-list {
    width: 800px;
  }
}
</style>