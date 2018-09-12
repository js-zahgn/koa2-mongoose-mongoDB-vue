<template>
  <header>
    <div class="userInfo">
      <input type="file" name="file" accept="image/*" @change="getImg">
      <img :src="user.userImg" v-if="user.userImg != null">
      <svg height="28" width="28" viewBox="0 0 16 16" aria-hidden="true" v-else>
        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    </div>
    <div class="signDaysList">
      <span>{{user.userName}}</span>
      <ul>
        <li v-for="i in 5" :key="i">
          <em v-if="i > 1 && signCount > i"></em>
          <span v-if="!isSigned && i == signCount + 1" class="unSign" @click="signIn">{{i}}</span>
          <span v-else>{{i}}</span>
          <b v-if="i < 5" :class="{sign: i < signCount}"></b>
          <van-icon name="checked" v-if="i <= signCount"/>
          <div v-if="i == 5">
            <van-icon name="wechat" class="getGift" v-if="signCount==5"
              @click="getGift"/>
            <van-icon name="chat" v-else/>
          </div>
        </li>
      </ul>
    </div>
    <div class="signDays">
      <span><b>连续</b><b>签到</b></span><em>{{signCount}}</em><i>天</i>
    </div>
  </header>
</template>
<script>

import {getMoment} from '@/UIConfig/filters'
import {Url} from '@/UIConfig/api'
import {Toast} from 'vant'
export default {
  name: 'signIn',
  data() {
    return {
      isSigned: false,
      signCount: 0,
      signDays: [],
      userImg: null,
      user: {}
    }
  },
  created () {
    const _this = this;
    if(localStorage.userName) {
      this.user = localStorage.userName
    }
    const d = new Date()
    _this.$http.get(Url.getUserSignInfo).then(res => {
      _this.signCount = res.data.data.signCount;
      _this.signDays = res.data.data.signDate;
      _this.isSigned = getMoment(d) == getMoment(res.data.data.signDate[0]);
    })
    _this.getUserImg()
  },
  methods: {
    getUserImg() {
      const _this = this
      _this.$http.get(Url.getUserInfo).then(res => _this.user = res.data.data)
    },
    signIn() {
      const _this = this;
      const d = new Date();
      _this.$http.post(Url.signInAction, {date: d.getTime()}).then(res => {
        _this.signCount = res.data.data.signCount;
        _this.signDays = res.data.data.signDate;
        _this.isSigned = getMoment(d) == getMoment(res.data.data.signDate[0]);
        Toast.success('签到成功')
      })
    },
    getGift() {
      const _this = this;
      this.$http.post(Url.clearSignInfo, {}).then(res => {
        _this.signDays = [];
        _this.signCount = 0;
      })
    },
    getImg(e) {
      const _this = this;
      const file = e.srcElement.files[0];
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = (v) => {
        const base64 = v.currentTarget.result
        const typeC = base64.split(',')[0].split(':')[1].split(';')[0]
        const scale = 1.5
        _this.scaleImg(base64, scale, typeC, data => {
          _this.$http.post(Url.uploadUserImg, {img: data}).then(res => {
            _this.user = res.data.data
          })
        })
      }
    },
    scaleImg(base64, scale, type, cb) {
      const _this = this
      const tempImg = new Image();
      tempImg.src = base64;
      tempImg.onload = () => {
        const _canvas = document.createElement("canvas");
        const w = tempImg.width / scale;
        const h = tempImg.height / scale;
        _canvas.setAttribute("width", w);
        _canvas.setAttribute("height", h);
        _canvas.getContext("2d").drawImage(tempImg, 0, 0, w, h)
        const base = _canvas.toDataURL(type);
        _canvas.toBlob(blob => {
          if(blob.size > 100 * 1024) {
            // 递归调用，知道图片小于100kb
            _this.scaleImg(base, scale, type, cb);
          }else{
            cb(_canvas.toDataURL(type));
          }
        }, type);
      }
    }
  }
}
</script>
<style lang="less" scoped>
@keyframes mo {
  0%{transform: translateY(1px)}
  50%{transform: translateY(-1px)}
  100%{transform: translateY(1px)}
}
header{
  display: flex;
  padding: 15px 10px;
  align-items: center;
  background:linear-gradient(to bottom, #E60081 ,#D21851);
  .userInfo{
    width: 3rem;
    text-align: center;
    height: 3rem;
    line-height: 3rem;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    background-color: #fff;
    svg{
      width: 100%;
      height: 100%;
      fill: #ccc;
    }
    img{
      width: 100%;
    }
    input{
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
  .signDaysList{
    flex: 3;
    color: #fff;
    >span{
      display: block;
      width: 5rem;
      line-height: 1.75rem;
      margin-left: 1rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    ul{
      display: flex;
      padding-left: 1rem;
      li{
        position: relative;
        flex:1;
        >span{
          display: inline-block;
          width: 1.15rem;
          height: 1.15rem;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          text-align: center;
          font-size: .75rem;
          line-height: 1.15rem; 
          box-shadow: 0px 1px 3px inset rgba(0, 0, 0, 0.3);
        }
        .unSign{
          box-shadow: 0 0 20px #b2ecba;
        }
        >b{
          position: absolute;
          background-color: #C71064;
          box-shadow: 0 1px 3px inset rgba(0,0,0,.2);
          width: .7rem;
          height: .25rem;
          top: 47%;
          right: -.1rem;
          z-index: 1;
        }
        >b.sign{
          background-color: #fff;
          height: 0.2rem;
          top: 40%;
          box-shadow: none;
        }
        >i{
          position: absolute;
          left: -.05rem;
          top: -0.01rem;
          font-size: 1rem;
          color: #F6AA04;
          border: 2px solid #fff;
          background-color: #fff;
          border-radius: 50%;
          z-index: 2;
        }
      }
      li:last-child{
        >div{
          top: -1.15rem;
          left: .15rem;
          position: absolute;
          .getGift{
            color:#B2D483;
            animation: mo 1.5s linear infinite;
          }
        }
      }
    }
  }
  .signDays{
    flex: 2;
    height: 40px;
    color: #E60081;
    border-radius: 20px;
    background-color: #fff;
    box-shadow: 1px 1px 5px inset #646060;
    display: flex;
    margin-top: 20px;
    font-size: .8rem;
    span{
      flex: 6;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: .7rem;
      b{
        font-weight: bolder;
      }
    }
    em{
      flex: 1;
      font-weight: 600;
      font-size: 1.25rem;
      line-height: 40px;
    }
    i{
      flex:2 ;
      line-height: 45px;
      padding-left: 2px;
    }
  }
}
</style>

