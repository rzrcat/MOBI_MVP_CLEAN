"use strict";(()=>{var e={};e.id=55,e.ids=[55],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},98216:e=>{e.exports=require("net")},68621:e=>{e.exports=require("punycode")},76162:e=>{e.exports=require("stream")},82452:e=>{e.exports=require("tls")},17360:e=>{e.exports=require("url")},71568:e=>{e.exports=require("zlib")},55303:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>m,patchFetch:()=>f,requestAsyncStorage:()=>x,routeModule:()=>p,serverHooks:()=>v,staticGenerationAsyncStorage:()=>_});var s={};t.r(s),t.d(s,{GET:()=>l,POST:()=>c});var i=t(49303),n=t(88716),a=t(60670),o=t(20344),u=t(71615),d=t(87070);async function l(e,{params:r}){let t=(0,o.createRouteHandlerClient)({cookies:u.cookies}),s=r.id;try{let{data:e,error:r}=await t.from("rune_reviews").select(`
        id, 
        content, 
        created_at,
        likes,
        dislikes,
        is_blinded,
        users:user_id (
          id,
          full_name,
          avatar_url
        )
      `).eq("rune_id",s).eq("is_blinded",!1).order("created_at",{ascending:!1});if(r)return console.error("Error fetching rune reviews:",r),d.NextResponse.json({error:r.message},{status:500});let{data:i}=await t.auth.getSession(),n=i?.session?.user?.id,a={};if(n){let{data:r}=await t.from("rune_review_reactions").select("review_id, reaction_type").eq("user_id",n).in("review_id",e.map(e=>e.id));a=r?.reduce((e,r)=>(e[r.review_id]=r.reaction_type,e),{})||{}}let o=e.map(e=>{let r=e.users;return{id:e.id,content:e.content,author:Array.isArray(r)?{id:r[0]?.id,name:r[0]?.full_name||"익명 사용자",avatar:r[0]?.avatar_url}:{id:r?.id,name:r?.full_name||"익명 사용자",avatar:r?.avatar_url},createdAt:e.created_at,likes:e.likes||0,dislikes:e.dislikes||0,isLiked:"like"===a[e.id],isDisliked:"dislike"===a[e.id],isBlinded:e.is_blinded}});return d.NextResponse.json(o)}catch(e){return console.error("Unexpected error in rune reviews GET:",e),d.NextResponse.json({error:"Server error occurred"},{status:500})}}async function c(e,{params:r}){let t=(0,o.createRouteHandlerClient)({cookies:u.cookies}),s=r.id,{data:i}=await t.auth.getSession();if(!i?.session?.user)return d.NextResponse.json({error:"Authentication required"},{status:401});try{let{content:r}=await e.json();if(!r||0===r.trim().length)return d.NextResponse.json({error:"한줄평 내용이 필요합니다."},{status:400});if(r.length>100)return d.NextResponse.json({error:"한줄평은 100자 이내여야 합니다."},{status:400});let n=i.session.user.id,{data:a}=await t.from("rune_reviews").select("id").eq("rune_id",s).eq("user_id",n);if(a&&a.length>0)return d.NextResponse.json({error:"이미 이 룬에 대한 한줄평을 작성하셨습니다."},{status:400});let{data:o,error:u}=await t.from("rune_reviews").insert({rune_id:s,user_id:n,content:r}).select(`
        id, 
        content, 
        created_at,
        likes,
        dislikes,
        is_blinded,
        users:user_id (
          id,
          full_name,
          avatar_url
        )
      `).single();if(u)return console.error("Error creating rune review:",u),d.NextResponse.json({error:u.message},{status:500});let l=o.users;return d.NextResponse.json({id:o.id,content:o.content,author:Array.isArray(l)?{id:l[0]?.id,name:l[0]?.full_name||"익명 사용자",avatar:l[0]?.avatar_url}:{id:l?.id,name:l?.full_name||"익명 사용자",avatar:l?.avatar_url},createdAt:o.created_at,likes:0,dislikes:0,isLiked:!1,isDisliked:!1,isBlinded:!1})}catch(e){return console.error("Unexpected error in rune review POST:",e),d.NextResponse.json({error:"Server error occurred"},{status:500})}}let p=new i.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/runes/[id]/reviews/route",pathname:"/api/runes/[id]/reviews",filename:"route",bundlePath:"app/api/runes/[id]/reviews/route"},resolvedPagePath:"/Users/s/Desktop/dev/mobi.gg/src/app/api/runes/[id]/reviews/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:x,staticGenerationAsyncStorage:_,serverHooks:v}=p,m="/api/runes/[id]/reviews/route";function f(){return(0,a.patchFetch)({serverHooks:v,staticGenerationAsyncStorage:_})}}};var r=require("../../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[948,972,518,958],()=>t(55303));module.exports=s})();