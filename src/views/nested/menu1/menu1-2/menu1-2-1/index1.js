
const response = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json',
);
const data = await response.json();
 // 自定义tooltip插件，鼠标悬停显示详情信息
 const tooltip1 = new G6.Tooltip({
    offsetX: -80,
    offsetY: -60,
    getContent(e: any) {
      const outDiv = document.createElement('div');
      outDiv.style.width = '180px';
      outDiv.innerHTML = `<ul>
        <li>${e.item?.getModel().label}</li>
      </ul>`
      return outDiv;
    },
    itemTypes: ['node']
  });
export { data,tooltip1 }

