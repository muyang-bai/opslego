import{s as b,v as y,d as h,a as s,i as l,e as o,x as v,t as r,F as w,j as k,f as p,w as B,u as _,y as C,n as u,z as i}from"./index-DTVN-OhD.js";import{_ as E}from"./_plugin-vue_export-helper-DlAUqK2U.js";const M={key:0,class:"absolute -top-3 left-1/2 transform -translate-x-1/2"},j={class:"text-center mb-6"},R={class:"text-2xl font-bold text-text-primary mb-2"},S={class:"flex items-baseline justify-center mb-4"},T={class:"text-4xl font-bold text-text-primary"},I={class:"text-text-secondary ml-1"},L={class:"space-y-3 mb-8"},N={class:"text-text-secondary"},P={__name:"PricingCard",props:{plan:{type:Object,required:!0}},setup(e){const c=b(),m=y(),x=d=>{if(!m.isAuthenticated){i.confirm("订阅套餐需要先登录，是否立即登录？","提示",{confirmButtonText:"去登录",cancelButtonText:"取消",type:"info"}).then(()=>{c.push(`/login?redirect=/pricing&plan=${d}`)});return}f()},f=d=>{i({title:"加入交流群，获取专属兑换码",message:`
      <div style="text-align: center; padding: 20px;">
        <div style="background: #f5f5f5; padding: 30px; border-radius: 12px; margin: 20px 0;">
          <p style="color: #666; margin-bottom: 20px;">（此处放置QQ/微信群二维码）</p>
          <div style="width: 200px; height: 200px; background: #ddd; margin: 0 auto; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
            <span style="color: #999;">二维码占位图</span>
          </div>
        </div>
        <p style="color: #666; margin-bottom: 10px; text-align: left;">
          <strong>操作流程：</strong>
        </p>
        <ol style="color: #666; text-align: left; margin-bottom: 20px; padding-left: 20px;">
          <li>扫码加群后，联系管理员转账并获取兑换码</li>
          <li>管理员在线时间：每天9:00-23:00，通常5分钟内回复</li>
        </ol>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
          <button id="goRedeem" style="flex: 1; margin-right: 10px; padding: 10px; background: #00B4D8; color: white; border: none; border-radius: 6px; cursor: pointer;">
            已加群，去激活
          </button>
          <button id="closeModal" style="flex: 1; padding: 10px; background: #f0f0f0; color: #666; border: none; border-radius: 6px; cursor: pointer;">
            关闭
          </button>
        </div>
      </div>
    `,dangerouslyUseHTMLString:!0,showCancelButton:!1,showConfirmButton:!1,closeOnClickModal:!1,beforeClose:(t,n,a)=>{t==="confirm"&&a()}}).then(()=>{}).catch(()=>{}),setTimeout(()=>{const t=document.getElementById("goRedeem"),n=document.getElementById("closeModal");t&&t.addEventListener("click",()=>{i.close(),c.push("/redeem")}),n&&n.addEventListener("click",()=>{i.close()})},100)};return(d,t)=>{const n=h("el-icon");return s(),l("div",{class:u(["bg-white rounded-2xl shadow-card p-8 border-2 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-2",e.plan.popular?"border-primary border-opacity-50 relative":"border-transparent"])},[e.plan.popular?(s(),l("div",M,[...t[1]||(t[1]=[o("span",{class:"bg-primary text-white px-4 py-1 rounded-full text-sm font-medium"}," 最受欢迎 ",-1)])])):v("",!0),o("div",j,[o("h3",R,r(e.plan.name),1),o("div",S,[o("span",T,r(e.plan.price),1),o("span",I,r(e.plan.period),1)])]),o("ul",L,[(s(!0),l(w,null,k(e.plan.features,(a,g)=>(s(),l("li",{key:g,class:"flex items-center"},[p(n,{class:"text-green-500 mr-3"},{default:B(()=>[p(_(C))]),_:1}),o("span",N,r(a),1)]))),128))]),o("button",{onClick:t[0]||(t[0]=a=>x(e.plan.id)),class:u(["w-full py-3 rounded-xl font-medium transition-all duration-200 hover:-translate-y-0.5",e.plan.popular?"bg-primary text-white hover:bg-primary-dark hover:shadow-button-hover":"bg-gray-100 text-text-primary hover:bg-gray-200"])},r(e.plan.buttonText),3)],2)}}},z=E(P,[["__scopeId","data-v-697d5669"]]);export{z as P};
