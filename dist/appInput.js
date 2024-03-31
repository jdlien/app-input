(function(p,s){typeof exports=="object"&&typeof module<"u"?module.exports=s():typeof define=="function"&&define.amd?define(s):(p=typeof globalThis<"u"?globalThis:p||self,p.AppInput=s())})(this,function(){"use strict";var a=Object.defineProperty;var f=(p,s,e)=>s in p?a(p,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):p[s]=e;var n=(p,s,e)=>(f(p,typeof s!="symbol"?s+"":s,e),e);class p{constructor(e={}){n(this,"hasEndTag",!1);n(this,"id","");n(this,"type","text");n(this,"name","");n(this,"label",null);n(this,"value","");n(this,"error","");n(this,"options");n(this,"required",!1);n(this,"fullWidth",!1);n(this,"horizontal",!1);n(this,"errorClass","");n(this,"noErrorEl",!1);n(this,"emptyOption",!0);n(this,"classDefault","block w-full px-1.5");n(this,"useMarkdown",!1);n(this,"attributesString","");n(this,"labelEl","");n(this,"descriptionEl","");n(this,"prefixEl","");n(this,"suffixEl","");n(this,"errorEl","");n(this,"colorEl","");n(this,"html","");n(this,"htmlEnd","");n(this,"borderColor","border-zinc-350 dark:border-zinc-500");n(this,"borderStone","border-stone-350 dark:border-stone-500");n(this,"prefixSuffixColor","bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400");n(this,"prefixSuffixStone","bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-400");n(this,"labelClassDefault","block font-medium sm:mt-px sm:pt-1");n(this,"prefixClassDefault","px-1 min-w-[30px] border border-r-0 inline-flex items-center justify-center");n(this,"suffixClassDefault","px-1 border border-l-0");n(this,"errorClassDefault","error hidden text-sm text-red-600 transition dark:text-red-500");n(this,"descriptionClassDefault","mt-1 text-sm text-zinc-500 dark:text-zinc-400");window.location.hostname.includes("www2")&&(this.borderColor=this.borderStone,this.prefixSuffixColor=this.prefixSuffixStone),this.prefixClassDefault+=" "+this.prefixSuffixColor+" "+this.borderColor,this.suffixClassDefault+=" "+this.prefixSuffixColor+" "+this.borderColor,e=this.setupInputAttributes(e),this.type=e.type,this.hasEndTag=["select","textarea","button"].some(i=>i===this.type.toLowerCase()),this.required=e.required??!1,this.horizontal=e.horizontal??!1,this.id=e.id,this.name=e.name,this.emptyOption=e.emptyOption??!0,this.options=this.normalizeOptions(e.options??[]),this.value=e.value??"",this.error=e.error??"",this.fullWidth=e.fullWidth??!1,e["full-width"]&&(this.fullWidth=e["full-width"]),this.labelEl=this.generateLabelEl(e),this.colorEl=this.generateColorEl(e),this.errorEl=this.generateErrorEl(e),this.prefixEl=this.generatePrefixEl(e),this.suffixEl=this.generateSuffixEl(e),this.descriptionEl=this.generateDescriptionEl(e),this.attributesString=this.generateAttributesString(e)}generateId(e){return e.id?e.id:e.name?e.name+"-"+Math.random().toString(36).slice(2):"input-"+Math.random().toString(36).slice(2)}faIcon(e){return`<i class="fa fa-${e}" aria-hidden="true"></i>`}setupInputAttributes(e){var l;switch(e.id=this.generateId(e),e.name||(e.name=e.id),e!=null&&e.pattern&&(e["data-pattern"]=e.pattern),e.type=((l=e.type)==null?void 0:l.toLowerCase())??"text",e.type){case"select":e.classDefault??(e.classDefault="block w-full"),e.placeholder&&(e["data-placeholder"]=e.placeholder);break;case"textarea":e.classDefault??(e.classDefault="block w-full border");break;case"checkbox":e.classDefault??(e.classDefault="");break;case"radio":e.classDefault??(e.classDefault="");break;case"decimal":e.type="text";case"number":e.inputmode??(e.inputmode="decimal"),e["data-type"]??(e["data-type"]="decimal");break;case"integer":e.type="text",e.inputmode??(e.inputmode="numeric"),e["data-type"]??(e["data-type"]="integer");break;case"email":e.inputmode??(e.inputmode="email"),e.prefix??(e.prefix=this.faIcon("envelope")),e.placeholder??(e.placeholder="____@____.___"),e["data-type"]??(e["data-type"]="email");break;case"postal":e.type="text",e["data-type"]="postal",e.prefix??(e.prefix=this.faIcon("map-marker-alt")),e.placeholder??(e.placeholder="___ ___");break;case"url":e.inputmode??(e.inputmode="url"),e.prefix??(e.prefix=this.faIcon("link")),e.placeholder??(e.placeholder="https://____.___");break;case"tel":case"phone":e.inputmode??(e.inputmode="tel"),e.type??(e.type="tel"),e.prefix??(e.prefix=this.faIcon("phone")),e.placeholder??(e.placeholder="___-___-____"),e["data-type"]??(e["data-type"]="tel");break;case"date":e.prefix??(e.prefix=this.faIcon("calendar-alt")),e.placeholder??(e.placeholder="YYYY-Mmm-D"),e["data-type"]="date",e.type="text";break;case"datetime":e.prefix??(e.prefix=this.faIcon("calendar-day")),e.placeholder??(e.placeholder="YYYY-Mmm-D h:mm AM"),e["data-type"]="datetime",e.type="text";break;case"time":e.prefix??(e.prefix=this.faIcon("clock")),e.placeholder??(e.placeholder="H:MM AM"),e["data-type"]="time",e.type="text";break;case"password":e.prefix??(e.prefix=this.faIcon("lock"));break;case"color":e.prefix??(e.prefix=this.faIcon("palette")),e["data-type"]="color",e.type="text";break;case"markdown":this.useMarkdown=!0,e["data-markdown"]=!0,e.type="textarea";break;case"submit":e.classDefault??(e.classDefault="btn-primary block w-full text-lg");break;case"display":e.classDefault??(e.classDefault="block w-full sm:mt-px sm:pt-1")}return e.classDefault??(e.classDefault="block w-full px-1.5 transition"),e}classAttr(e,l){const i=`${e}ClassDefault`,o=l;let d=i in o?o[i]:this[i]||"";e==="label"&&this.fullWidth&&(d+=" sm:col-span-3");const c=o[`${e}Class`]||"";return`class="${d.trim()} ${c.trim()}"`}generateLabelEl(e){if(e.label===void 0||e.label===null)return"";e.label==="true"&&(e.label="");const l=this.classAttr("label",e);return`<label
    for="${e.id}"
    id="${e.id}-label"
    ${l}>${e.label}</label>`}generateColorEl(e){if(e["data-type"]!=="color")return"";const l=e.value?e.value:"#888888";return`
      <label id="${e.id}-color-label"
        for="${e.id}-color"
        class="min-w-[30px] border border-l-0 ${this.borderColor} cursor-pointer"
        style="background-color: ${l}"
      >
        <input type="color"
          id="${e.id}-color"
          class="invisible w-full h-full"
          value="${l}"
        />
      </label>
    `}generateErrorEl(e){return e.noErrorEl?"":`<div class="min-h-[20px]"><div ${this.classAttr("error",e)} id="${e.id}-error"></div></div>`}generatePrefixEl(e){if(!e.prefix)return"";let l=e.id||"";this.colorEl&&(l+="-color");const i=this.classAttr("prefix",e);return`<label for="${l}" ${i}>${e.prefix}</label>`}generateSuffixEl(e){if(!e.suffix)return"";const l=this.classAttr("suffix",e);return`<label for="${e.id}" id="${e.id}-suffix" ${l}>${e.suffix}</label>`}generateDescriptionEl(e){return e.description?`<p ${this.classAttr("description",e)}>${e.description}</p>`:""}generateAttributesString(e){const l=(e.classDefault?e.classDefault+" ":"")+(e.class?e.class:"");let o=`class="${Array.from(new Set(l.split(" "))).join(" ")}"`;["select","textarea","display"].includes(e.type||"")||(o+=` type="${e.type}"`);const d=["checked","disabled","readonly","required","multiple"],c=d.concat(["class","type","error","errorClass","classDefault","labelClassDefault","data-fp-options","options","horizontal","description","label","prefix","value"]);this.type==="display"&&c.push("maxLength","name","placeholder"),d.forEach(r=>{e[r]!==!1&&typeof e[r]<"u"&&(o+=` ${r}`)});for(const r in e)c.includes(r)||(o+=` ${r.toLowerCase()}="${e[r]}"`);if(o+=` data-error-default="${e.error||""}"`,e["data-fp-options"]&&(o+=` data-fp-options='${e["data-fp-options"]}'`),e.maxLength&&(o+=` data-max-length="${e.maxLength}"`),this.labelEl&&(o+=` aria-labelledby="${this.id}-label"`),this.errorEl&&(o+=` aria-describedby="${this.id}-error"`),!this.hasEndTag&&e.value!==void 0){const r=String(e.value).replace(/"/g,"&quot;").replace(/'/g,"&#39;");o+=` value="${r}"`}return o}normalizeOptions(e){return e.map(l=>{if(typeof l=="string")return{value:l,label:l};if(l===void 0||l.value===void 0)throw new Error("Option must have a value. Remove undefined/NULL values.");const i=l.value.length>1?l.value.replace(/,$/,""):l.value,o="label"in l?l.label:i,d={value:i,label:o};return l.description!==void 0&&(d.description=l.description),l.selected!==void 0&&(d.selected=l.selected),d})}generateOptions(e){const l=this.horizontal?"shadow-inner rounded-2xl bg-zinc-300/10 flex flex-wrap items-center space-x-0.5":"mb-3 space-y-3",i=this.horizontal?"p-0.5":"py-1";let o=`<div class="sm:col-span-2 ${l}">`,d=1;for(let c of e){const r=`${this.id}-${d++}-${String(c.value).replace(/[^\da-z]/gi,"")}`;o+=`<div class="${i}">`,o+=`<div class="flex ${this.horizontal?"items-center":"items-start"}">`,o+=`
        <label
          class="checked-border ${this.type==="radio"?"rounded-full":""}"
          for="${r}">
            <input
              id="${r}"
              ${this.required?"required":""}
              name="${this.name}"
              type="${this.type}"
              value="${c.value}"
              ${this.error?`data-error-default="${this.error}"`:""}
              ${this.value==c.value&&this.value!==""?"checked":""}
              ${c.selected===!0?"checked":""}
              class="block transition"
              ${this.errorEl?`aria-describedby="${this.id}-error"`:""}
            />
            <span class="checked-label">${c.label}</span>
          </label>`,o+="</div>",c.description&&(o+=`<div class="mt-2 text-sm">${c.description}</div>`),o+="</div>"}return o+="</div>",o}start(){if(["checkbox","radio"].includes(this.type)&&(!this.options||this.options.length==0)){let d=this.value?this.value.toString():"0";d.toLowerCase()==="no"&&(d="0");const c=d?"checked":"";return`${this.labelEl}
      <div class="my-0.5 sm:mt-0 sm:col-span-2 pt-2">
        <div class="flex relative">
          <input ${this.type=="display"?"disabled":""} ${this.attributesString} ${c}/>
        </div>
        ${this.descriptionEl}
        ${this.errorEl}
      </div>`}const e=this.fullWidth?"sm:col-span-3":"sm:col-span-2";if(this.hasEndTag){let d=this.type==="button"?this.value:"";return`${this.labelEl}
      <div class="mb-0.5 mt-1 sm:mt-0 ${e}">
        <${this.type} ${this.attributesString}>${d}`}let l=this.labelEl;l+=`<div class="my-0.5 sm:mt-0 ${e}">
        <div class="flex relative">`;const i=Array.isArray(this.options)&&this.options.length>0,o=["select","radio","checkbox"].includes(this.type);return i&&o?l+=this.generateOptions(this.options):this.type==="display"?l+=`<span ${this.attributesString}>${this.value}</span>`:l+=`${this.prefixEl}<input ${this.attributesString} />${this.colorEl}${this.suffixEl}`,l+=`
      </div>
        ${this.descriptionEl}
        ${this.errorEl}
      </div>`,l}end(){if(!this.hasEndTag)return"";let e="";if(this.type==="textarea"){const l=document.createElement("textarea");l.textContent=this.value,e+=l.innerHTML}if(this.type==="select"){this.emptyOption&&(e+='<option value=""></option>');const i=(typeof this.value<"u"?String(this.value).split(","):[]).filter(o=>o!=="");this.options.forEach(o=>{typeof o=="string"&&(o={value:o,label:o}),e+=`
        <option value="${o.value}"
          ${i.includes(String(o.value))?"selected":""}
        >${o.label}</option>`})}return e+=`</${this.type}>`,e+=`${this.descriptionEl}`,e+=`${this.errorEl}`,e+=`</div><!-- end AppInput type=${this.type} -->`,e}getFormItem(){let e=document.createElement("div");return e.className="form-item",e.innerHTML=this.start()+this.end(),e}getFormItemHTML(){return this.getFormItem().outerHTML}appendToForm(e){e.appendChild(this.getFormItem())}}return p});
