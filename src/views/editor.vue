<template>
  <div>
    <div id="titile">
      <a-input v-model:value="content.title" placeholder="标题" size="large" />
    </div>
    <div id="ed">
      <div id="editorB"></div>
    </div>
    <div id="pass">
      <a-button type="primary" @click="put_txt" style="margin-right: 10px"
        >提交</a-button
      >
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { useStore } from "vuex";
import { onMounted } from "@vue/runtime-core";
import E from "wangeditor";
import hljs from "highlight.js";
import axios from "axios";
import { reactive } from "vue";
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {
    ad() {
      this.get_html;
      const ad = document.getElementById("ad");
      ad.innerHTML = this.content.html;
    },
  },
  setup() {
    const store = useStore();
    const data = store.state;
    //富文本数据
    const content = reactive({
      id: "",
      title: "",
      html: "",
      img: [],
      path:''
    });
    const toimg = reactive([]);
    let editor;
    //创建编辑器
    onMounted(() => {
      const ed = document.getElementById("editorB");
      editor = new E(ed);
      editor.config.height = 600;
      editor.config.pasteFilterStyle = false;
      // editor.config.showLinkImg = false
      editor.highlight = hljs;
      editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        console.log("上传");
        const d = new FormData();
        d.append("file", resultFiles[0]);
        // data.host[0] + "/editor/upimg",{file:d,account:data.lives.Account}
       d.append('account',data.lives.Account)
       d.append('token',data.lives.token)
        axios
          .post(data.host[0] + "/editor/upimg",d,{headers:{'content-Type':'multipart/form-data'}})
          .then((res) => {
            // 上传图片，返回结果，将图片插入到编辑器中
            console.log(res.data);
            const url = res.data.data[0].url;
            content.img.push(url);
            insertImgFn(url);
          })
          .catch((e) => {
            console.log(e);
          });
      };

      editor.config.uploadImgAccept = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "webp",
      ];
      // editor.config.colors = ["#000000", "#eeece0", "#1c487f", "#4d80bf"];
      editor.create();
      if (data.get_blog != "") {
        //请求数据 txt.文章id
        axios
          .post(data.host[0] + "/view_blog", { id: data.get_blog })
          .then((res) => {
            if (res.data[0].code == 0) {
              content.title = res.data[1].msg[0].title;
              content.id = res.data[1].msg[0].id;
              content.path= res.data[1].msg[0].text;
              editor.txt.html(res.data[1].msg[0].txt);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
    // img过滤
    const image = () => {
      const puimg = editor.txt.html();
      const img = puimg.match(/<img.*?(?:>|\/>)/gi);
      for (var i in img) {
        const src = img[i].match(/src=['"]?([^'"]*)['"]?/i);
        const u = src[0].split("'")[1];
        toimg.push(u);
      }
      for (var k in content.img){
        for(var j in toimg){
          if (content.img[k]==toimg[j]){
            content.img.splice(i,1)
          }
        }
      }
      console.log(content.img);
    };
    //提交文本
    const put_txt = () => {
      image();
      var brief1 = editor.txt.text().substring(1, 20);
      var title1 = content.title;
      var id1 = content.id;
      var txt1 = editor.txt.html();
      var path1=content.path
      var img1=content.img
      axios
        .post(data.host[0] + "/sub/blogs", { brief: brief1, title: title1,id:id1,txt:txt1,account:data.lives.Account,path:path1,img:img1,token:data.lives.token })
        .then((res) => {
          console.log(res.data);
          if (res.data[0].code == 0) {
            message.info('提交成功')
            // content.title = res.data[1].msg[0].title;
            // content.id = res.data[1].msg[0].id;
            // editor.txt.html(res.data[1].msg[0].txt);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return {
      editor,
      put_txt,
      content,
    };
  },
};
</script>

<style lang='less'>
#ed {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  // align-items: center;
}
#pass {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
#editorB {
  width: 900px;
  // p {
  //   // color: black;
  // }
}
#titile {
  margin: auto;
  width: 500px;
}
</style>