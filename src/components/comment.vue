<template>
  <div id="comment">
    <a-list item-layout="horizontal" :data-source="data">
      <template #loadMore>
        <div
          :style="{
            textAlign: 'center',
            marginTop: '12px',
            height: '32px',
            lineHeight: '32px',
          }"
        >
          <a-button v-if="more" @click="reply_more">更多</a-button>
        </div>
      </template>
      <template #renderItem="{ item, index }">
        <a-comment>
          <template #actions>
            <span>
              <a @click="like(item.id, index)"><LikeFilled /></a>
              {{ item.like }}
            </span>
            <span>
              <a @click="show_reply2(item.id, item.reply)"
                ><messageOutlined
              /></a>

              {{ item.reply }}
            </span>
            <span key="comment-basic-reply-to" @click="show_toreply(index)"
              >回复</span
            >
          </template>
          <template #author
            ><a>{{ item.name }}</a></template
          >
          <template #avatar>
            <a-avatar
              :src="this.$store.state.host[0] + '/' + item.headP"
              :alt="item.name"
            />
          </template>
          <template #content>
            <p>
              {{ item.text }}
            </p>
            <!-- 回复 -->
            <div id="toreply" v-if="rindex == index">
              <a-textarea
                v-model:value="reply_value"
                show-count
                :maxlength="100"
              />
              <a-button type="primary" @click="to_reply(item.id)"
                >发布</a-button
              >
            </div>
          </template>
          <template #datetime>
            <a-tooltip :title="item.time">
              <span>{{ dayjs(item.time).fromNow() }}</span>
            </a-tooltip>
          </template>
        </a-comment>
      </template>
    </a-list>
    <!-- 二级评论 -->
    <a-modal v-model:visible="visible" width="900px" :footer="null">
      <a-list item-layout="horizontal" :data-source="data2">
        <template #loadMore>
          <div
            :style="{
              textAlign: 'center',
              marginTop: '12px',
              height: '32px',
              lineHeight: '32px',
            }"
          >
            <a-button v-if="more2" @click="reply_more2">更多</a-button>
          </div>
        </template>
        <template #renderItem="{ item, index }">
          <a-comment>
            <template #actions>
              <span>
                <a @click="like2(item.id, index)"> <LikeFilled /></a>
                {{ item.like }}
              </span>
              <span @click="show_toreply2(index)">回复</span>
            </template>
            <template #author>
              <a>{{ item.name }}</a
              >&nbsp; &nbsp; 回复 &nbsp; &nbsp;
              <a v-if="item.to != '0'">{{ item.to }}</a>
            </template>
            <template #avatar>
              <a-avatar
                :src="this.$store.state.host[0] + '/' + item.headP"
                :alt="item.name"
              />
            </template>
            <template #content>
              <p>
                {{ item.text }}
              </p>
              <!-- 回复 -->
              <div id="toreply" v-if="rindex2 == index">
                <a-textarea
                  v-model:value="reply_value2"
                  show-count
                  :maxlength="100"
                />
                <a-button type="primary" @click="to_reply2(item.name)"
                  >发布</a-button
                >
              </div>
            </template>
            <template #datetime>
              <a-tooltip :title="item.time">
                <span>{{ dayjs(item.time).fromNow() }}</span>
              </a-tooltip>
            </template>
          </a-comment>
        </template>
      </a-list>
    </a-modal>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { LikeFilled, MessageOutlined } from "@ant-design/icons-vue";
import relativeTime from "dayjs/plugin/relativeTime";
import { message } from "ant-design-vue";

dayjs.extend(relativeTime);
export default {
  components: {
    LikeFilled,
    MessageOutlined,
  },
  data() {
    return {
      reply_value: null,
      rindex: null,
      visible: false,
      more: false,
      reply_page: 0,
      data2: [],
      reply_value2: null,
      rindex2: null,
      more2: false,
      reply_page2: 0,
      reply_id: null,
      data: [],
    };
  },
  created() {
    this.reply("");
  },
  methods: {
    // 一级
    like(id, index) {
      if (this.$store.state.lives) {
        this.axios
          .post(this.$store.state.host[0] + "/i_like", {
            id: id,
            account: this.$store.state.lives.Account,
            token: this.$store.state.lives.token
          })
          .then((res) => {
            console.log(res.data);
            if (res.data[0].code == 0) {
              this.data[index].like += 1;
              message.info("点赞成功");
            } else if (res.data[0].code == 26) {
              message.info("已点赞");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        message.info("请登录");
      }
    },
    to_reply(id) {
      if (this.$store.state.lives) {
        this.axios
          .post(this.$store.state.host[0] + "/to_reply2", {
            id: id,
            account: this.$store.state.lives.Account,
            txt: this.reply_value,
            ton: 0,
            token:this.$store.state.lives.token
          })
          .then((res) => {
            console.log(res.data);
            if (res.data[0].code == 0) {
              message.info("回复成功");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        message.info("请登录");
      }
    },
    reply_more() {
      this.reply("next");
    },
    show_toreply(index) {
      if (this.$store.state.lives) {
        if (index == this.rindex) {
          this.rindex = null;
        } else {
          this.rindex = index;
        }
      } else {
        message.info("请登录");
      }
    },
    reply(next) {
      if (next == "next") {
        this.reply_page += 10;
      } else {
        this.reply_page = 0;
      }
      this.axios
        .post(this.$store.state.host[0] + "/find_comments", {
          id: this.$store.state.blogID,
          page: this.reply_page,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            if (next == "next") {
              this.data.push(res.data[1].msg);
            } else {
              this.data = res.data[1].msg;
            }

            var len = Object.keys(res.data[1].msg).length;
            if (len < 10) {
              this.more = false;
            } else {
              this.more = true;
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    show_reply2(id, count) {
      if (count > 0) {
        this.reply_id = id;
        this.get_reply2(id, "");
        this.visible = !this.visible;
      } else {
        message.info("没有消息");
      }
    },
    // 二级
    get_reply2(id, next) {
      console.log("显示二级");
      if (next == "next") {
        this.reply_page2 += 10;
      } else {
        this.reply_page2 = 0;
      }
      this.axios
        .post(this.$store.state.host[0] + "/find_comments2", {
          id: id,
          page: this.reply_page2,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            if (next == "next") {
              this.data2.push(res.data[1].msg);
            } else {
              this.data2 = res.data[1].msg;
            }
            var len = Object.keys(res.data[1].msg).length;
            if (len < 10) {
              this.more2 = false;
            } else {
              this.more2 = true;
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    show_toreply2(index) {
      if (index == this.rindex2) {
        this.rindex2 = null;
      } else {
        this.rindex2 = index;
      }
    },
    reply_more2() {
      this.get_reply2(this.reply_id, "next");
    },
    like2(id, index) {
      if (this.$store.state.lives) {
        this.axios
          .post(this.$store.state.host[0] + "/i_like2", {
            id: id,
            account: this.$store.state.lives.Account,
            token:this.$store.state.lives.token
          })
          .then((res) => {
            console.log(res.data);
            if (res.data[0].code == 0) {
              this.data2[index].like += 1;
              message.info("点赞成功");
            } else if (res.data[0].code == 26) {
              message.info("已点赞");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        message.info("请登录");
      }
    },
    to_reply2(name) {
      if (this.$store.state.lives) {
        this.axios
          .post(this.$store.state.host[0] + "/to_reply2", {
            id: this.reply_id,
            account: this.$store.state.lives.Account,
            txt: this.reply_value2,
            ton: name,
            token:this.$store.state.lives.token
          })
          .then((res) => {
            console.log(res.data);
            if (res.data[0].code == 0) {
              message.info("回复成功");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        message.info("请登录");
      }
    },
  },
  setup() {
    return {
      dayjs,
    };
  },
};
</script>

<style lang='less'>
#comment {
  width: 900px;
}
#toreply {
  width: 500px;
  float: right;
}
</style>