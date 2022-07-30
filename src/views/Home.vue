<template>
  <div>
    <div id="contentHome">
      <div id="homeL">
        <a-tabs v-model:activeKey="activekey" @change="tab">
          <a-tab-pane key="1">
            <template #tab>
              <span> 关注 </span>
            </template>

            <!-- 关注列 -->
            <a-list item-layout="vertical" :data-source="fans">
              <template #loadMore>
                <div
                  :style="{
                    textAlign: 'center',
                    marginTop: '12px',
                    height: '32px',
                    lineHeight: '32px',
                  }"
                >
                  <a-button v-if="fansmore" @click="loadMore('fans')"
                    >更多</a-button
                  >
                </div>
              </template>
              <template #renderItem="{ item }">
                <a-list-item>
                  <template #actions>
                    <span>
                      <component v-bind:is="'EyeOutlined'" />
                      {{ item.view }}</span
                    >
                  </template>
                  <a-list-item-meta :description="item.brief">
                    <template #title>
                      <a @click="toBlogs(item.id)">{{ item.title }}</a>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
            <!-- 关注列 -->
          </a-tab-pane>

          <!-- 推荐列 -->
          <a-tab-pane key="2">
            <template #tab>
              <span> 推荐 </span>
            </template>
            <a-list item-layout="vertical" :data-source="referrer">
              <template #loadMore>
                <div
                  :style="{
                    textAlign: 'center',
                    marginTop: '12px',
                    height: '32px',
                    lineHeight: '32px',
                  }"
                >
                  <a-button v-if="referrermore" @click="loadMore('referrer')"
                    >更多</a-button
                  >
                </div>
              </template>
              <template #renderItem="{ item }">
                <a-list-item>
                  <template #actions>
                    <span>
                      <component v-bind:is="'EyeOutlined'" />
                      {{ item.view }}</span
                    >
                  </template>
                  <a-list-item-meta :description="item.brief">
                    <template #title>
                      <a @click="toBlogs(item.id)">{{ item.title }}</a>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
            <!-- 推荐列 -->
          </a-tab-pane>
          <a-tab-pane key="3">
            <template #tab>
              <span> 热门 </span>
            </template>
            <!-- 热门列 -->
            <a-list
              item-layout="vertical"
              :data-source="hot"
              :loading="initLoading"
            >
              <template #loadMore>
                <div
                  :style="{
                    textAlign: 'center',
                    marginTop: '12px',
                    height: '32px',
                    lineHeight: '32px',
                  }"
                >
                  <a-button v-if="hotmore" @click="loadMore('hot')"
                    >更多</a-button
                  >
                </div>
              </template>
              <template #renderItem="{ item }">
                <a-list-item>
                  <template #actions>
                    <span>
                      <component v-bind:is="'EyeOutlined'" />
                      {{ item.view }}</span
                    >
                  </template>
                  <a-list-item-meta :description="item.brief">
                    <template #title>
                      <a @click="toBlogs(item.id)">{{ item.title }}</a>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
            <!-- 热门列 -->
          </a-tab-pane>
        </a-tabs>
      </div>

      <div id="homeR">
        <div
          :style="{
            width: '300px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
          }"
        >
          <a-calendar :fullscreen="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { RightOutlined } from "@ant-design/icons-vue";
import { useStore } from "vuex";
// import { message } from "ant-design-vue";

import { EyeOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
export default {
  components: {
    EyeOutlined,
  },
  data() {
    return {
      initLoading: true,
      activekey: "3", //选项卡
      hot: [],
      referrer: [],
      fans: [],
      hotpage: 0,
      referrerpage: 0,
      fanspage: 0,
      hotmore: false,
      referrermore: false,
      fansmore: false,
    };
  },
  created() {
    this.axios
      .post(this.$store.state.host[0] + "/find_hot", { page: 0 })
      .then((res) => {
        if (res.data[0].code == 0) {
          this.hot = res.data[1].msg;
          var len = Object.keys(res.data[1].msg).length;
          if (len < 10) {
            this.hotmore = false;
          } else {
            this.hotmore = true;
          }
        }
        this.initLoading = false;
      })
      .catch((e) => {
        console.log(e);
      });
  },
  methods: {
    //列表切换
    tab() {
      switch (this.activekey) {
        case "1":
          this.fanspage = 0;
          if (this.$store.state.lives) {
            this.axios
              .post(this.$store.state.host[0] + "/find_fans", {
                page: this.fanspage,
                account: this.$store.state.lives.Account,
                token:this.$store.state.lives.token
              })
              .then((res) => {
                if (res.data[0].code == 0) {
                  this.fans = res.data[1].msg;
                  var len = Object.keys(res.data[1].msg).length;
                  if (len < 10) {
                    this.fansmore = false;
                  } else {
                    this.fansmore = true;
                  }
                } else if (res.data[0].code == -1) {
                  message.warning("请求异常");
                }
              })
              .catch((e) => {
                message.warning("网络异常");
                this.fansmore = false;
                console.log(e);
              });
          } else {
            this.fansmore = false;
            message.info("请登录", 1);
          }
          break;
        case "2":
          this.referrerpage = 0;
          if (this.$store.state.lives) {
            this.axios
              .post(this.$store.state.host[0] + "/find_suggest", {
                page: this.referrerpage,
                account: this.$store.state.lives.Account,
                token: this.$store.state.lives.token,
              })
              .then((res) => {
                if (res.data[0].code == 0) {
                  this.referrer = res.data[1].msg;
                  var len = Object.keys(res.data[1].msg).length;
                  if (len < 10) {
                    this.referrermore = false;
                  } else {
                    this.referrermore = true;
                  }
                } else if (res.data[0].code == 28) {
                  message.info("请添加个性标签", 1);
                }
              })
              .catch((e) => {
                message.warning("网络异常");
                this.referrermore = false;
                console.log(e);
              });
          } else {
            this.referrermore = false;
            message.info("请登录", 1);
          }

          break;
        case "3":
          this.hotpage = 0;
          this.axios
            .post(this.$store.state.host[0] + "/find_hot", {
              page: this.hotpage,
            })
            .then((res) => {
              if (res.data[0].code == 0) {
                this.hot = res.data[1].msg;
                var len = Object.keys(res.data[1].msg).length;
                if (len < 10) {
                  this.hotmore = false;
                } else {
                  this.hotmore = true;
                }
              }
            })
            .catch((e) => {
              message.warning("网络异常", 1);
              this.hotmore = false;
              console.log(e);
            });
          break;
      }
    },
    loadMore(val) {
      if (val == "hot") {
        this.hotpage += 10;
        this.axios
          .post(this.$store.state.host[0] + "/find_hot", { page: this.hotpage })
          .then((res) => {
            if (res.data[0].code == 0) {
              this.hot.push(res.data[1].msg);
              var len = Object.keys(res.data[1].msg).length;
              if (len < 10) {
                this.hotmore = false;
              } else {
                this.hotmore = true;
              }
            } else if (res.data[0].code == 1) {
              this.hotmore = false;
            }
          })
          .catch((e) => {
            message.warning("网络异常", 1);
            console.log(e);
          });
      } else if (val == "referrer" && this.store.state.lives) {
        this.referrerpage += 10;
        this.axios
          .post(this.$store.state.host[0] + "/find_suggest", {
            page: this.referrerpage,
            account: this.$store.state.lives.Account,
            token: this.$store.state.lives.token,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data[0].code == 0) {
              this.hot.push(res.data[1].msg);
              var len = Object.keys(res.data[1].msg).length;
              if (len < 10) {
                this.referrermore = false;
              } else {
                this.referrermore = true;
              }
            } else if (res.data[0].code == 1) {
              this.referrermore = false;
            }
          })
          .catch((e) => {
            message.warning("网络异常", 1);
            console.log(e);
          });
      } else if (val == "fans" && this.store.state.lives) {
        this.fanspage += 10;
        this.axios
          .post(this.$store.state.host[0] + "/find_suggest", {
            page: this.fanspage,
            account: this.$store.state.lives.Account,
            token: this.$store.state.lives.token,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data[0].code == 0) {
              this.hot.push(res.data[1].msg);
              var len = Object.keys(res.data[1].msg).length;
              if (len < 10) {
                this.fansmore = false;
              } else {
                this.fansmore = true;
              }
            } else if (res.data[0].code == 1) {
              this.fansmore = false;
            }
          })
          .catch((e) => {
            message.warning("网络异常", 1);
            console.log(e);
          });
      }
    },
    toBlogs(v) {
      this.$store.state.blogID = v;
      this.$router.push({ path: "/blogs" });
    },
  },
  setup() {
    const store = useStore();
    const data = store.state;

    return {
      data,
    };
  },
};
</script>

<style lang='less'>
#contentHome {
  // float: right;
  // margin-right: 100px;
  margin-top: 50px;
  height: 1000px;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  // align-items: center;
  right: 10px;
  #homeL {
    .ant-tabs {
      width: 600px;
    }
  }
  #homeR {
    margin-left: 5px;
  }
}
</style>
 