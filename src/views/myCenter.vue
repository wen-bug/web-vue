<template>
  <div id="myC">
    <div id="brief">
      <div style="height: 100px">
        <a-avatar
          v-if="ulist.headP"
          style="float: left"
          :size="64"
          :src="this.$store.state.host[0] + '/' + ulist.headP"
        />
        <ul class="brief_m">
          <li>{{ ulist.userName }}</li>
          <li>{{ ulist.sign }}</li>
          <li>
            <a>粉丝:{{ count.by_watch }}</a> &nbsp;&nbsp;
            <a>关注:{{ count.watch }}</a>
          </li>
        </ul>
        <a
          v-if="this.$store.state.lives.Account == ulist.Account"
          style="margin-left: 150px"
          @click="to()"
          >个人中心</a
        >
        <a v-else-if="this.$store.state.blogID.watch" style="margin-left: 150px"
          >已关注</a
        >
        <a
          v-else-if="this.$store.state.lives == false"
          @click="to_login"
          style="margin-left: 150px"
          >关注</a
        >
      </div>
      <!-- 文章 -->
      <a-tabs v-model:activeKey="activeKey" @change="change_f">
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


        <!-- 关注 -->
        <a-tab-pane key="3" tab="关注">
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
                    v-if="
                      this.$store.state.lives.Account == ulist.Account ||
                      item.watch
                    "
                    type="primary"
                    @click="over(item.Account, index)"
                    >已关注</a-button
                  >
                  <a-button
                    v-else-if="item.watch == ''"
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
import { useRouter } from "vue-router";
import { EyeOutlined } from "@ant-design/icons-vue";
export default {
  components: {
    EyeOutlined,
  },
  data() {
    return {
      activeKey: "1",
      collect: [{ name: "默认收藏夹" }],
      ulist: [],
      count: [],
      blog_page: 0,
      user_page: 0,
      blogs: [],
      user: [],
      blogs_more: false,
      user_more: false,
    };
  },
   watch: {
    "$store.state.blogID": {
      deep: true,
      handler: function () {
       this.user_list()
      },
    },
  },
  created() {
    this.user_list();
    this.get_blog(this.$store.state.lives.Account, "");
    console.log(this.$store.state.blogID);
  },
  methods: {
    to_login() {
      message.warning("请登录");
    },
    over(id, index) {
      this.axios
        .post(this.$store.state.host[0] + "/overlook", {
          star: id,
          account: this.$store.state.lives.Account,
          token:this.$store.state.lives
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
    to_findu(id, v, u) {
      if (v == "next") {
        this.user_page += 10;
      } else {
        this.user_page = 0;
      }
      this.axios
        .post(this.$store.state.host[0] + "/watch", {
          u: u,
          page: this.user_page,
          account: id,
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
    get_blog(id, v) {
      if (v == "next") {
        this.blog_page += 10;
      } else {
        this.blog_page = 0;
      }
      
      this.axios
        .post(this.$store.state.host[0] + "/find_blogu", {
          page: this.blog_page,
          account: id,
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
    },
    user_list() {
      if (this.$store.state.blogID == "") {
        if (this.$store.state.lives == false) {
          this.$router.push({ path: "/" });
        } else {
          // 自己
          this.ulist = this.$store.state.lives;
          this.get_f(this.$store.state.lives.Account);
          // this.get_blog(this.$store.state.lives.Account, "");
        }
      } else {
        var id = this.$store.state.blogID.Account;
        if (id == this.$store.state.lives.Account) {
          // 自己
          this.ulist = this.$store.state.lives;
          this.get_f(this.$store.state.lives.Account);
          // this.get_blog(this.$store.state.lives.Account, "");
        } else {
          // 别人
          this.axios
            .post(this.$store.state.host[0] + "/my_user", {
              account: this.$store.state.blogID.Account,
            })
            .then((res) => {
              if (res.data[0].code == 0) {
                this.ulist = res.data[1].msg[0];
                this.get_f(this.$store.state.blogID.Account);
              }
              if (res.data[0].code == 1) {
                this.blogs_more = false;
              }
            })
            .catch((e) => {
              console.log(e);
            });
          // this.get_blog(this.$store.state.blogID.Account);
        }
      }
    },
    get_f(id) {
      this.axios
        .post(this.$store.state.host[0] + "/get_fans", {
          account: id,
          token:this.$store.state.lives.token
        })
        .then((res) => {
          if (res.data[0].code == 0) {
            this.count = res.data[1].msg[0];
          } else {
            message.warning("请求异常", 1);
          }
        })
        .catch((e) => {
          message.warning("网络异常", 1);
          this.blogs_more = false;
          console.log(e);
        });
    },
    change_f() {
      switch (this.activeKey) {
        case "1":
          this.get_blog(this.ulist.Account, "");
          break;
        case "3":
          if (this.$store.state.lives) {
            if (this.ulist.Account == this.$store.state.lives.Account) {
              this.to_findu(this.ulist.Account, "", "");
            } else {
              this.to_findu(
                this.ulist.Account,
                "",
                this.$store.state.lives.Account
              );
            }
          } else {
            this.to_findu(this.ulist.Account, "", "");
          }
      }
    },
    loadMore(val) {
      if (val == "blogs") {
        this.get_blog(this.ulist.Account, "next");
      }
      if (val == "user") {
        if (this.$store.state.lives) {
          if (this.ulist.Account == this.$store.state.lives.Account) {
            this.to_findu(this.ulist.Account, "next", 0);
          } else {
            this.to_findu(this.ulist.Account, "next", 1);
          }
        } else {
          this.to_findu(this.ulist.Account, "next", 0);
        }
      }
    },
  },
  beforeUnmount() {
    this.$store.state.blogID = "";
  },
  setup() {
    const router = useRouter();
    const show = (name) => {
      console.log(name);
    };
    const to = () => {
      router.push({ path: "/personal" });
    };
    return {
      show,
      to,
    };
  },
};
</script>

<style lang='less'>
#myC {
  margin-top: 50px;
  #brief {
    width: 900px;
    margin: auto;
    .brief_m {
      display: inline-block;
      list-style-type: none;
      li {
        padding-top: 3px;
      }
    }
  }
}
</style>